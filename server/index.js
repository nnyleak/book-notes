import express from "express";
import cors from "cors";
import pg from "pg";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const SECRET = "this_is_a_secret"; // in production, use a more secure method to store secrets

const db = new pg.Client({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "book archive",
  password: process.env.PG_PASSWORD || "Kjraxoxo_3",
  port: process.env.PG_PORT ? +process.env.PG_PORT : 5433,
});
db.connect();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

app.use(cors());
app.use(express.json());

app.get("/books", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to retrieve books" });
  }
});

app.get("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);
    const book = result.rows[0];

    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to retrieve book details" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, hashed]
  );

  res.json(result.rows[0]);
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ error: "invalid password" });
  }

  const token = jwt.sign({ userId: user.id}, SECRET);
  res.json({ token });
})

app.post("/books/preview", async (req, res) => {
  const { isbn } = req.body;

  try {
    const olResp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);

    if (!olResp.ok) {
      return res.status(400).json({ error: "invalid isbn or book not found" });
    }

    const olData = await olResp.json();

    let workData = null;
    let authorData = null;

    if (olData.works?.length > 0) {
      const workKey = olData.works[0].key;
      const workResp = await fetch(`https://openlibrary.org${workKey}.json`);
      if (workResp.ok) {
        workData = await workResp.json();
      }
    }

    if (olData.authors?.length > 0) {
      const authorKey = olData.authors[0].key;
      const authorResp = await fetch(
        `https://openlibrary.org${authorKey}.json`,
      );
      if (authorResp.ok) {
        authorData = await authorResp.json();
      }
    }

    const coverData = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    res.json({
      title: olData.title || "unknown title",
      author_name: authorData?.name || "unknown author",
      description:
        workData?.description?.value ||
        workData?.description ||
        "description not available",
      cover_url: coverData || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "preview failed" });
  }
});

app.post("/books", auth, async (req, res) => {
  const { isbn, title, author_name, description, cover_url, rating, review, date_finished } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO books(isbn, title, author_name, description, cover_url, rating, review, date_finished) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [isbn, title, author_name, description, cover_url, rating, review, date_finished],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add book" });
  }
});

// edit thoughts on book
app.put("/books/:id", auth, async (req, res) => {
  const { rating, review, date_finished } = req.body;

  try {
    const result = await db.query(
      `UPDATE books
      SET rating = $1, review = $2, date_finished = $3
      WHERE id = $4
      RETURNING *`,
      [rating, review, date_finished, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to update book" });
  }
});

// delete entries
app.delete("/books/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.json({ message: "book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to delete book" });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

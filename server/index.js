import express from "express";
import cors from "cors";
import pg from "pg";
import fetch from "node-fetch";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "book archive",
  password: process.env.PG_PASSWORD || "Kjraxoxo_3",
  port: process.env.PG_PORT ? +process.env.PG_PORT : 5433,
});
db.connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server!");
});

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

    let olData = null;
    let workData = null;
    let authorData = null;

    // fetch book using isbn
    if (book.isbn) {
      const olResp = await fetch(
        `https://openlibrary.org/isbn/${book.isbn}.json`,
      );
      if (olResp.ok) {
        olData = await olResp.json();

        // extract works olid and its data
        if (olData.works && olData.works.length > 0) {
          const workKey = olData.works[0].key; // "/works/workskey"

          const workResp = await fetch(`https://openlibrary.org${workKey}.json`);
          if (workResp.ok) {
            workData = await workResp.json();
          }
        }

        if (olData.authors && olData.authors.length > 0) {
          const authorKey = olData.authors[0].key; // "authors/authorskey"

          const authorResp = await fetch(
            `https://openlibrary.org${authorKey}.json`,
          );
          if (authorResp.ok) {
            authorData = await authorResp.json();
          }
        }
      }
    }

    res.json({
      ...book,
      title: olData?.title || book.title,
      description: workData?.description?.value || workData?.description || "description not available",
      cover_id: olData?.covers?.[0],
      author_name: authorData?.name || "author not available",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to retrieve book details" });
  }
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const resp = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`,
    );
    const json = await resp.json();
    res.json(json.docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to search books" });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, isbn } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO books (title, author, description) VALUES ($1, $2, $3) RETURNING *",
      [title, author, isbn],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add book" });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

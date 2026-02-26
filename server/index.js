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

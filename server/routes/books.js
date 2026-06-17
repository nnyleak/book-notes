import express from "express";
import sql from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const baseUrl = "https://openlibrary.org";

// get all books from db
router.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM books`;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to retrieve books" });
  }
});

// get book details
router.get("/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await sql`SELECT * FROM books WHERE id = ${bookId}`;
    const book = result[0];

    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to retrieve book details" });
  }
});

// book search preview
router.post("/preview", async (req, res) => {
  const { isbn } = req.body;

  try {
    const olResp = await fetch(`${baseUrl}/isbn/${isbn}.json`, {
      signal: AbortSignal.timeout(30000),
    });

    if (!olResp.ok) {
      return res.status(404).json({ error: "book not found" });
    }

    const olData = await olResp.json();

    let workData = null;
    let authorData = null;

    const workKey = olData.works?.[0]?.key;
    const authorKey = olData.authors?.[0]?.key;

    // fetch work and author in parallel to reduce latency
    const [workResp, authorResp] = await Promise.all([
      workKey ? fetch(`${baseUrl}${workKey}.json`, { signal: AbortSignal.timeout(30000) }) : Promise.resolve(null),
      authorKey ? fetch(`${baseUrl}${authorKey}.json`, { signal: AbortSignal.timeout(30000) }) : Promise.resolve(null),
    ]);

    if (workResp?.ok) workData = await workResp.json();
    if (authorResp?.ok) authorData = await authorResp.json();

    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    res.json({
      title: olData.title || "unknown title",
      author_name: authorData?.name || "unknown author",
      // OL description is sometimes a plain string, sometimes { type, value }
      description:
        workData?.description?.value ||
        workData?.description ||
        "description not available",
      cover_url: coverUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "preview failed" });
  }
});

// add new book into db
router.post("/", auth, async (req, res) => {
  const {
    isbn,
    title,
    author_name,
    description,
    cover_url,
    rating,
    review,
    date_finished,
  } = req.body;
  try {
    const result = await sql`INSERT INTO books
            (isbn, title, author_name, description, cover_url, rating, review, date_finished)
            VALUES (${isbn}, ${title}, ${author_name}, ${description}, ${cover_url}, ${rating}, ${review}, ${date_finished})
            RETURNING *`;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add book" });
  }
});

// edit entry
router.put("/:id", auth, async (req, res) => {
  const { rating, review, date_finished } = req.body;

  try {
    const result = await sql`UPDATE books 
        SET rating = ${rating}, 
            review = ${review}, 
            date_finished = ${date_finished} 
        WHERE id = ${req.params.id} RETURNING *`;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to update book" });
  }
});

// delete entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const result =
      await sql`DELETE FROM books WHERE id = ${req.params.id} RETURNING *`;
    res.json({ message: "book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to delete book" });
  }
});

export default router;

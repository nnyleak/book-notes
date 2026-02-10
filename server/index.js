import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book archive",
  password: "Kjraxoxo_3",
  port: 5433,
});
db.connect();

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello from server!");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
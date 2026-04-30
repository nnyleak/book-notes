import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import booksRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/books", booksRoutes);
app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

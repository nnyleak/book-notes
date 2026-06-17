import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../auth";
import BookCard from "../components/BookCard";
import Nav from "../components/Nav";
import "./Home.css";

const SORT_OPTIONS = [
  { key: "recently_added", label: "recently added" },
  { key: "date_finished",  label: "date finished" },
  { key: "alphabetical",   label: "alphabetical"  },
  { key: "rating",         label: "rating"        },
];

function sortBooks(books, sort) {
  const sorted = [...books];
  switch (sort) {
    case "recently_added":
      return sorted.sort((a, b) => b.id - a.id);
    case "date_finished":
      // nulls last
      return sorted.sort((a, b) => {
        if (!a.date_finished) return 1;
        if (!b.date_finished) return -1;
        return new Date(b.date_finished) - new Date(a.date_finished);
      });
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "rating":
      // nulls last
      return sorted.sort((a, b) => {
        if (!a.rating) return 1;
        if (!b.rating) return -1;
        return b.rating - a.rating;
      });
    default:
      return sorted;
  }
}

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("recently_added");

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${API_URL}/books`)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("failed to load books");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>loading books...</div>;
  if (error) return <div>error: {error}</div>;

  const sortedBooks = sortBooks(books, sort);

  return (
    <div className="content">
      <Nav />
      <div className="grid-wrapper">
        <p id="header">welcome to my book archive! ⋆˚꩜｡ here you'll find books i've read and my thoughts about them!</p>
        <div className="sort-bar">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={sort === opt.key ? "sort-btn active" : "sort-btn"}
              onClick={() => setSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="books-grid">
          {sortedBooks.map((b, i) => (
            <BookCard
              key={b.id}
              book={b}
              index={i}
              onClick={() => navigate(`/book/${b.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

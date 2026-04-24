import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import Nav from "../components/Nav";
import { isLoggedIn, logout } from "../auth";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:3000/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("failed to load books");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>loading books...</div>;
  }

  if (error) {
    return <div>error: {error}</div>;
  }

  return (
    <div>
      <Nav />
      <div className="grid-wrapper">
        <div className="books-grid">
          {books.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              onClick={() => navigate(`/book/${b.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

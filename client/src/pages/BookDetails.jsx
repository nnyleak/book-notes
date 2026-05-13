import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isLoggedIn } from "../auth";
import Nav from "../components/Nav";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) return <div>loading...</div>;

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  const handleStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push("★");
      } else {
        stars.push("☆");
      }
    }
    return stars;
  };

  return (
    <div className="content">
      <Nav />
      <div className="details-container">
        <div className="cover-frame">
          <img src={book.cover_url} alt={`${book.title} cover`} />
        </div>

        <div className="details-frame">
          <h2>TITLE:</h2>
          <p className="detail">{book.title}</p>
          <h2>AUTHOR:</h2>
          <p className="detail">{book.author_name}</p>
          <div className="description-box detail">
            <h2>DESCRIPTION:</h2>
            <p className="description">
              {expanded
                ? book.description
                : `${book.description.slice(0, 400)}${
                    book.description.length > 400 ? "..." : ""
                  }`}
            </p>

            {book.description.length > 400 && (
              <button
                type="button"
                className="read-more"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "read less" : "read more"}
              </button>
            )}
          </div>
          <h2>MY RATING:</h2>
          {book.rating && (
            <p className="rating detail">{handleStars(book.rating).join("")}</p>
          )}
        </div>

        <div className="review-container">
          <h3>my thoughts:</h3>

          <p>
            {book.date_finished &&
              new Date(book.date_finished).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </p>

          <p>{book.review || "no review yet"}</p>

          {isLoggedIn() && (
            <div className="admin-actions">
              <button onClick={() => navigate(`/book/${id}/edit`)}>
                edit entry
              </button>
              <button onClick={handleDelete}>delete entry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;

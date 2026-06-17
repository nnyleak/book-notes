import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, API_URL } from "../auth";
import Nav from "../components/Nav";
import StarRating from "../components/StarRating";
import "./BookDetails.css";
import "./EditBook.css";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [dateFinished, setDateFinished] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/books/${id}`).then((res) => {
      const data = res.data;
      setBook(data);
      setRating(data.rating || 0);
      setReview(data.review || "");
      setDateFinished(data.date_finished?.slice(0, 10) || "");
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/books/${id}`,
        { rating, review, date_finished: dateFinished },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      navigate(`/book/${id}`);
    } catch (err) {
      console.error(err);
      alert("failed to save changes");
    }
  };

  if (!book) return <div>loading...</div>;

  return (
    <div className="content">
      <Nav />
      <form className="details-container" onSubmit={handleSubmit}>
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
          <div className="detail rating-input">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>

        <div className="review-container">
          <h3>my thoughts:</h3>
          <textarea
            className="review-textarea"
            placeholder="write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="date-row">
            <span className="date-label">finished on</span>
            <input
              className="date-input"
              type="date"
              value={dateFinished}
              onChange={(e) => setDateFinished(e.target.value)}
            />
          </div>
          <div className="admin-actions">
            <button type="submit">save</button>
            <button type="button" onClick={() => navigate(`/book/${id}`)}>
              cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditBook;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, isLoggedIn } from "../auth";
import "./AddBook.css";
import Nav from "../components/Nav";
import StarRating from "../components/StarRating";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [dateFinished, setDateFinished] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setBookData(null);
    setExpanded(false);

    try {
      const res = await axios.post("http://localhost:3000/books/preview", {
        isbn,
      });
      setBookData(res.data);
      setRating(0);
      setReview("");
      setDateFinished("");
    } catch (err) {
      console.error(err);
      alert("book not found");
    }

    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      await axios.post(
        "http://localhost:3000/books",
        {
          isbn,
          ...bookData,
          rating: Number(rating),
          review,
          date_finished: dateFinished || null,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      navigate("/");
    } catch (err) {
      console.error(err.response);
      alert("failed to add book");
    }
  };

  return (
    <div className="content">
      <Nav />
      <div className="add-container">
        {!bookData && (
          <>
            <h1>add book</h1>
            <p id="header">search for a book by isbn to archive --</p>
            <input
              className="isbn-input"
              placeholder="enter isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <button onClick={handleSearch}>
              <img src={arrowIcon} alt="arrow icon" id="arrow-icon" />
              {loading ? "searching..." : "search"}
            </button>{" "}
          </>
        )}

        {bookData && (
          <div className="book-preview">
            <div className="cover-frame">
              {bookData.cover_url && (
                <img
                  className="book-cover"
                  src={bookData.cover_url}
                  alt={`${bookData.title} cover`}
                />
              )}
            </div>

            <div className="book-info">
              <h1>{bookData.title}</h1>
              <p className="author">by {bookData.author_name}</p>
              {bookData.description && (
                <div className="description-box">
                  <p id="description">
                    {expanded
                      ? bookData.description
                      : `${bookData.description.slice(0, 1000)}${
                          bookData.description.length > 1000 ? "..." : ""
                        }`}
                  </p>

                  {bookData.description.length > 1000 && (
                    <button
                      type="button"
                      className="read-more"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "read less" : "read more"}
                    </button>
                  )}
                </div>
              )}

              {/* <div className="edit-fields">
                <h3 className="edit-title">REVIEW</h3>

                <StarRating rating={rating} setRating={setRating} />

                <textarea
                  placeholder="review goes here"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <input
                  type="date"
                  value={dateFinished}
                  onChange={(e) => setDateFinished(e.target.value)}
                />
              </div> */}

              <button id="add-btn" onClick={handleAdd}>add "{bookData.title}"</button>
              <button
                id="search-another-btn"
                onClick={() => {
                  setBookData(null);
                  setRating(0);
                  setReview("");
                  setDateFinished("");
                  setExpanded(false);
                }}
              >
                search another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBook;

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
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setBookData(null);

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
        <h1>add book</h1>
        <p id="header">search for a book by isbn to archive --</p>
        <input
          placeholder="enter isbn"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <button onClick={handleSearch}>
          <img src={arrowIcon} alt="arrow icon" id="arrow-icon" />
          {loading ? "searching..." : "search"}
        </button>

        {bookData && (
          <div className="book-preview">
            {bookData.cover_url && (
              <img className="book-cover" src={bookData.cover_url} alt={`${bookData.title} cover`} />
            )}

            <div className="book-info">
              <h2>{bookData.title}</h2>
              <p>{bookData.author_name}</p>
              <p>{bookData.description}</p>

              <div className="edit-fields">
                <StarRating rating={rating} setRating={setRating} />

                <textarea
                  placeholder="update review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <input
                  type="date"
                  value={dateFinished}
                  onChange={(e) => setDateFinished(e.target.value)}
                />
              </div>

              <button onClick={handleAdd}>add book</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBook;

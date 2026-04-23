import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, isLoggedIn } from "../auth";

function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [rating, setRating] = useState("");
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
      setRating("");
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
    <div>
      <h1>Add a Book</h1>
      <input
        placeholder="enter isbn"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
      />
      <button onClick={handleSearch}>
        {loading ? "searching..." : "search"}
      </button>

      {bookData && (
        <div className="book-preview">
          {bookData.cover_url && (
            <img src={bookData.cover_url} alt={`${bookData.title} cover`} />
          )}

          <h2>{bookData.title}</h2>
          <p>{bookData.author_name}</p>
          <p>{bookData.description}</p>

          <div className="edit-fields">
            <input
              type="number"
              min="1"
              max="5"
              placeholder="your rating (1-5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />

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
      )}
    </div>
  );
}

export default AddBook;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, API_URL } from "../auth";
import "./AddBook.css";
import "./BookDetails.css";
import Nav from "../components/Nav";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setBookData(null);
    setExpanded(false);

    try {
      const res = await axios.post(`${API_URL}/books/preview`, { isbn });
      setBookData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        alert("book not found");
      } else {
        alert("search timed out — try again");
      }
    }

    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/books`,
        {
          isbn,
          ...bookData,
          rating: 0,
          review: "",
          date_finished: null,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      const newBook = res.data[0];
      navigate(`/book/${newBook.id}/edit`);
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
            </button>
          </>
        )}

        {bookData && (
          <div className="details-container">
            <div className="cover-frame">
              {bookData.cover_url && (
                <img src={bookData.cover_url} alt={`${bookData.title} cover`} />
              )}
            </div>

            <div className="details-frame">
              <h2>TITLE:</h2>
              <p className="detail">{bookData.title}</p>
              <h2>AUTHOR:</h2>
              <p className="detail">{bookData.author_name}</p>
              {bookData.description && (
                <div className="description-box detail">
                  <h2>DESCRIPTION:</h2>
                  <p className="description">
                    {expanded
                      ? bookData.description
                      : `${bookData.description.slice(0, 400)}${
                          bookData.description.length > 400 ? "..." : ""
                        }`}
                  </p>
                  {bookData.description.length > 400 && (
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
            </div>

            <div className="review-container">
              <div className="admin-actions">
                <button onClick={handleAdd}>add "{bookData.title}"</button>
                <button onClick={() => { setBookData(null); setExpanded(false); }}>
                  search another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBook;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
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
    } catch (err) {
      console.error(err);
      alert("book not found");
    }

    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:3000/books", { isbn, ...bookData});
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
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
          {bookData.cover_id && (
            <img
              src={`https://covers.openlibrary.org/b/id/${bookData.cover_id}-L.jpg`}
              alt={`${bookData.title} cover`}
            />
          )}

          <h2>{bookData.title}</h2>
          <p>{bookData.author_name}</p>
          <p>{bookData.description}</p>

          <button onClick={handleAdd}>add book</button>
        </div>
      )}
    </div>
  );
}

export default AddBook;

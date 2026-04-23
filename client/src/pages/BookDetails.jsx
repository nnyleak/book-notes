import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) return <div>loading...</div>;

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/books/${id}`)
    .then(() => navigate("/"))
    .catch((err) => console.error(err));
  };

  return (
    <div>
      <img
        src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
        alt={`${book.title} cover`}
      />
      <h1>{book.title}</h1>
      <p>by {book.author_name}</p>
      <h3>Description:</h3>
      <p>{book.description}</p>
      <h3>My Thoughts:</h3>
      <p>{book.rating}/5</p>
      <p>{book.review || "no review yet"}</p>
      <button onClick={() => navigate(`/book/${id}/edit`)}>edit entry</button>
      <button onClick={handleDelete}>delete entry</button>
    </div>
  );
}

export default BookDetails;

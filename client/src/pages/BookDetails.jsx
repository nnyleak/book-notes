import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isLoggedIn } from "../auth";
import Nav from "../components/Nav";

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
    axios
      .delete(`http://localhost:3000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Nav />
      <img src={book.cover_url} alt={`${book.title} cover`} />
      <h1>{book.title}</h1>
      <p>by {book.author_name}</p>
      <h3>Description:</h3>
      <p>{book.description}</p>
      <h3>My Thoughts:</h3>
      <p>{book.rating}/5</p>
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
                <button onClick={() => navigate(`/book/${id}/edit`)}>edit entry</button>
                <button onClick={handleDelete}>delete entry</button>
            </div>
        )}
      {/* <button onClick={() => navigate(`/book/${id}/edit`)}>edit entry</button>
      <button onClick={handleDelete}>delete entry</button> */}
    </div>
  );
}

export default BookDetails;

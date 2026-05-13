import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../auth";
import Nav from "../components/Nav";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [dateFinished, setDateFinished] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/books/${id}`).then((res) => {
      const data = res.data;
      setBook(data);

      setRating(data.rating || "");
      setReview(data.review || "");
      setDateFinished(data.date_finished?.slice(0, 10) || "");
    });
  }, [id]);

  const handleSubmit = async () => {
    await axios
      .put(
        `http://localhost:3000/books/${id}`,
        {
          rating,
          review,
          date_finished: dateFinished,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      )
      .then(() => navigate(`/book/${id}`))
      .catch((err) => console.error(err));
  };

  return (
    <div className="content">
      <Nav />

      <div className="edit-container" onSubmit={handleSubmit}>
        <div className="edit-card">
          <h1>edit entry</h1>

          <p className="edit-title">{book?.title}</p>

          <form
            className="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>rating:</label>
            <input type="number" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />

            <label>review:</label>
            <textarea value={review} onChange={(e) => setReview(e.target.value)}></textarea>

            <label>date finished:</label>
            <input
              type="date"
              value={dateFinished}
              onChange={(e) => setDateFinished(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit">save</button>
              <button type="button" onClick={() => navigate(`/book/${id}`)}>
                cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBook;

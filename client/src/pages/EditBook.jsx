import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../auth";

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
      .put(`http://localhost:3000/books/${id}`, {
        rating,
        review,
        date_finished: dateFinished,
      }, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        }
      })
      .then(() => navigate(`/book/${id}`))
      .catch((err) => console.error(err));
  };

  return (
    <div onSubmit={handleSubmit}>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <input
        type="date"
        value={dateFinished}
        onChange={(e) => setDateFinished(e.target.value)}
      />
      <button type="submit" onClick={handleSubmit}>save</button>
      <button type="submit" onClick={() => navigate(`/book/${id}`)}>cancel</button>
    </div>
  );
}

export default EditBook;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rating: "",
    review: "",
    date_finished: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:3000/books/${id}`, form)
    .then(() => navigate(`/book/${id}`))
    .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
        <input name="rating" value={form.rating} onChange={handleChange} />
        <textarea name="review" value={form.review} onChange={handleChange} />
        <input name="date_finished" value={form.date_finished} onChange={handleChange} />
        <button type="submit">save</button>
    </form>
  );
}

export default EditBook;

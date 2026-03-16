import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { use } from "react";

const apiCall = () => {
  axios.get("http://localhost:3000/").then((data) => {
    console.log(data);
  });
};

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/books").then((res) => {
      const bookDetailsPromises = res.data.map((b) =>
        axios
          .get(`http://localhost:3000/books/${b.id}`)
          .then((res) => res.data),
      );
      Promise.all(bookDetailsPromises).then(setBooks);
    });
  }, []);

  return (
    <div>
      <h1>kae.archive</h1>
      <div className="books-grid">
        {books.map((b) => (
          <div key={b.id} className="book-card">
            {b.cover_id && (
              <img
                src={`https://covers.openlibrary.org/b/id/${b.cover_id}-L.jpg`}
                alt={`${b.title} cover`}
              />
            )}
            <h2>{b.title}</h2>
            {b.author_name && <p className="author">{b.author_name}</p>}
            {b.description && <p className="description">{b.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

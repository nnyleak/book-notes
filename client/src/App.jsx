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
      setBooks(res.data);
    });
  }, []);

  return (
    <div>
      <h1>book archive</h1>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.title} - {b.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

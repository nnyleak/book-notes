import { useState } from "react";
import "./App.css";
import axios from "axios";

const apiCall = () => {
  axios.get("http://localhost:3000/").then((data) => {
    console.log(data);
  });
};

function App() {
  return (
    <>
      <div>
        <button onClick={apiCall}>make api call!</button>
      </div>
    </>
  );
}

export default App;

import "./BookCard.css";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function BookCard({book, index, onClick}) {
const handleStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push("★");
    } else {
      stars.push("☆");
    }
  }
  return stars;
}

  return (
    <div className="book-card">
      <div className="card-header">
        {index !== undefined && <p className="index">0{index + 1}</p>}
        {book.date_finished && <p className="date">{new Date(book.date_finished).toLocaleDateString()}</p>}
      </div>
      {book.cover_url && (
        <img className="cover"
          src={book.cover_url}
          alt={`${book.title} cover`}
        />
      )}
      <div className="card-content">
        <h2 className="title">{book.title}</h2>
        {book.author_name && <p className="author">by {book.author_name}</p>}
        {book.rating && <p className="rating">
          {handleStars(book.rating).join("")}
        </p>}
        <button onClick={onClick}>
          <img className="icon" src={arrowIcon} alt="arrow icon" />
          read my thoughts!
        </button>
      </div>
    </div>
  );
}

export default BookCard;

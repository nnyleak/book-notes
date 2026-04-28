import "./BookCard.css";

function BookCard({book, index, onClick}) {
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
        {book.rating && <p className="rating">rating: {book.rating}</p>}
        <button onClick={onClick}>read my thoughts!</button>
      </div>
    </div>
  );
}

export default BookCard;

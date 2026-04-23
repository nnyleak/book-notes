import "./BookCard.css";

function BookCard({book, onClick}) {
  return (
    <div className="book-card">
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={`${book.title} cover`}
        />
      )}
      <h2>{book.title}</h2>
      {book.author_name && <p className="author">by {book.author_name}</p>}
      {book.rating && <p className="rating">rating: {book.rating}</p>}
      <button onClick={onClick}>read my thoughts!</button>
    </div>
  );
}

export default BookCard;

function BookCard({book, onClick}) {
  return (
    <div className="book-card">
      {book.cover_id && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
          alt={`${book.title} cover`}
        />
      )}
      <h2>{book.title}</h2>
      {book.author_name && <p className="author">by {book.author_name}</p>}
      <button onClick={onClick}>read my thoughts!</button>
    </div>
  );
}

export default BookCard;

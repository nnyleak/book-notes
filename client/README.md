## kae/archive

a personal book archiving app for the books i've read, made with react! deployed on ___.

live demo → link

---

### **ᯓ★** features

- browse the book archive with cover art, ratings, and quick-view cards
- sort by recently added, date finished, alphabetical, or rating
- view full book details: includes book cover, author, description, my rating, date finished, and review
- admin actions:
- search any book by isbn, pulling data from the Open Library API
- add, edit, and delete entries
- protected by jwt authentication

---

### **ᯓ★** tech stack

**frontend**
- react 19 + react router v7
- axios
- vite

**backend**
- node.js + express 5
- postgresql (via `postgres`)
- jwt + bcrypt for auth

**external api**
- [open library](https://openlibrary.org/developers/api) — book metadata by isbn

---

### **ᯓ★** usage

1. clone this repo

    ```bash
    git clone https://github.com/yourusername/book-notes.git
    cd book-notes
    ```

2. set up environment variables

    create a `.env` file inside the `server/` directory:

    ```env
    DATABASE_URL=your_postgresql_connection_string
    SECRET=your_jwt_secret
    ```

3. install dependencies

    ```bash
    # server
    cd server
    npm install

    # client
    cd ../client
    npm install
    ```

4. run locally

    in one terminal (server):
    ```bash
    cd server
    node index.js
    ```

    in another terminal (client):
    ```bash
    cd client
    npm run dev
    ```

    open [http://localhost:5173](http://localhost:5173) in your browser

---

### **ᯓ★** notes

- book data is fetched from the Open Library api using isbn, i've experienced that it can be unreliable and not all isbns will return results, and response time may vary
- in the future, i would like to swap to Google Books API and use Open Library as a fallback
- only one admin account is supported; login credentials are managed directly in the database
- the app is read-only for guests
- adding, editing, and deleting entries requires logging in

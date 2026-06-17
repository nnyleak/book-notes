# kae/archive

a personal book archiving site for the books i've read, made with react, express, and postgresql! deployed on ___.

live demo → link

## ⭑ features

- browse the book archive with cover art, ratings, and quick-view cards
- sort by recently added, date finished, alphabetical, or rating
- view full book details: includes book cover, author, description, my rating, date finished, and review
- admin actions:
- search any book by isbn, pulling data from the Open Library API
- add, edit, and delete entries
- protected by jwt authentication

## ⭑ tech stack

- react
- vite
- node.js + express
- postgresql/supabase
- jwt authentication
- custom css
- [open library](https://openlibrary.org/developers/api) — book metadata by isbn

## ⭑ usage

1. clone this repo

    ```bash
    git clone https://github.com/nnyleak/book-notes.git
    cd book-notes
    ```

2. set up environment variables

    create a `.env` file inside the `server/` directory:

    ```env
    DATABASE_URL=your_postgresql_connection_string
    SECRET=your_jwt_secret
    ```

3. run the sql schema in schema.sql to initialize the database

4. install dependencies

    ```bash
    # server
    cd server
    npm install

    # client
    cd client
    npm install
    ```

5. run locally

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

## ⭑ notes

- book data is fetched from the Open Library api using isbn, i've experienced that it can be unreliable and not all isbns will return results, and response time may vary
- only one admin account is supported; login credentials are managed directly in the database
- the app is read-only for guests
- adding, editing, and deleting entries requires logging in

## ⭑ future improvements

- swap to Google Books API, use Open Library as fallback
- search by book title and/or author
- book genres
- user accounts
- custom collections

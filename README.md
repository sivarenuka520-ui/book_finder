import React, { useState } from "react";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBooks((data.docs || []).slice(0, 20));
    } catch (err) {
      setError("Something went wrong. Try again!");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">📚 Book Finder</h1>

      <div className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          placeholder="Search for a book..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.key} className="bg-white p-4 shadow rounded">
              <img
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "/images/dummy-image.webp"
                }
                alt={book.title}
                className="w-32 h-48 object-cover mx-auto"
              />
              <h2 className="mt-2 text-lg font-semibold">{book.title}</h2>
              <p>{book.author_name?.join(", ") || "Unknown Author"}</p>
              <p className="text-sm text-gray-500">
                {book.first_publish_year || "N/A"}
              </p>
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Open on OpenLibrary
              </a>
            </div>
          ))}
        </div>
      )}

      {hasSearched && !loading && books.length === 0 && (
        <p>No Books Found...</p>
      )}
    </div>
  );
}

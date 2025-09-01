import React, { useEffect, useState } from "react";

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
    if (!query) return;
    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBooks(data.docs.slice(0, 20));
    } catch (err) {
      setError("Something went wrong. Try again!");
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
          placeholder="Search for a book..."
          className="flex-1 p-2 border rounded-lg"
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button
          onClick={searchBooks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="w-full max-w-5xl">
        {loading ? (
          <div className="flex space-x-2 justify-center items-center h-20">
            <span className="sr-only">Loading...</span>
            <div className="h-5 w-1 bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-5 w-1 bg-blue-600 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-5 w-1 bg-blue-600 animate-bounce"></div>
            <div className="h-5 w-1 bg-blue-600 animate-bounce [animation-delay:0.15s]"></div>
          </div>
        ) : books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.key}
                className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : "public/images/dummy-image.webp"
                  }
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded"
                />

                <h2 className="mt-4 text-lg font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">
                  {book.author_name?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500">
                  {book.first_publish_year || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <div className="flex justify-center items-center h-20">
              <h1 className="text-center font-sans font-medium text-red-500 text-lg">
                Open on OpenLibrary
              </h1>
            </div>
          )
        )}
      </div>
    </div>
  );
}

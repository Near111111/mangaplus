import { useState, useEffect } from "react";
import "../App.css";
import "../styles/Home.css";
import ManwhaCard from "../components/ManwhaCard";
import SearchBar from "../components/SearchBar";

interface Manga {
  id: string;
  title: string;
  imgUrl: string;
  latestChapter: string;
  description: string;
}

interface MangaListResponse {
  pagination: number[];
  data: Manga[];
}

interface SearchResponse {
  keyword: string;
  count: number;
  manga: Manga[];
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [paginationPages, setPaginationPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HOME_API = "/api/manga-list";
  const SEARCH_API = "/api/search";

  const fetchHomeManga = async (page: number) => {
    try {
      setLoading(true);
      setIsSearching(false);
      setError(null);

      const response = await fetch(`${HOME_API}/${page}`);

      if (!response.ok) {
        throw new Error("Failed to fetch manga list");
      }

      const result: MangaListResponse = await response.json();

      if (result.data && result.data.length > 0) {
        setMangaData(result.data);
        setPaginationPages(result.pagination);
      } else {
        setError("No manga data available at the moment");
      }
    } catch (error) {
      console.error(error);
      setError(
        "The website is currently unavailable due to an unknown issue. Please try again later.",
      );
      setMangaData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      fetchHomeManga(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      setError(null);

      const formattedQuery = query.replace(/\s+/g, "_");
      const response = await fetch(`${SEARCH_API}/${formattedQuery}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result: SearchResponse = await response.json();

      setMangaData(result.manga || []);
      setPaginationPages([]);

      if (!result.manga || result.manga.length === 0) {
        setError("No results found for your search");
      }
    } catch (error) {
      console.error(error);
      setError("Search is currently unavailable. Please try again later.");
      setMangaData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DEBOUNCE ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ---------- MAIN EFFECT ---------- */
  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchSearchResults(debouncedSearch);
    } else {
      fetchHomeManga(currentPage);
    }
  }, [debouncedSearch, currentPage]);

  return (
    <>
      <SearchBar onSearch={setSearchQuery} />

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>{isSearching ? "Searching manga..." : "Loading manga..."}</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <h2>⚠️ {error}</h2>
          <p>Please check back later.</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="manwha-grid">
          {mangaData.map((manga) => (
            <ManwhaCard key={manga.id} manwha={manga} />
          ))}
        </div>
      )}

      {!isSearching && paginationPages.length > 0 && (
        <div className="pagination">
          {paginationPages.map((page) => (
            <button
              key={page}
              className={`pagination-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

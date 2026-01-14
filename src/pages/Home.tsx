import { useState, useEffect } from "react";
import "../App.css";
import ManwhaCard from "../components/ManwhaCard";
import SearchBar from "../components/SearchBar";

interface Manga {
  id: string;
  title: string;
  imgUrl: string;
  latestChapter?: string;
  latestChapters?: Array<{ name: string; chapter: string }>;
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

  // Direct API calls to gomanga
  const BASE_URL = "https://gomanga-api.vercel.app/api";

  const fetchHomeManga = async (page: number) => {
    try {
      setLoading(true);
      setIsSearching(false);

      const response = await fetch(`${BASE_URL}/manga-list/${page}`);
      const result: MangaListResponse = await response.json();

      setMangaData(result.data);
      setPaginationPages(result.pagination);
    } catch (error) {
      console.error(error);
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

      const formattedQuery = query.replace(/\s+/g, "_");
      const response = await fetch(`${BASE_URL}/search/${formattedQuery}`);
      const result: SearchResponse = await response.json();

      setMangaData(result.manga || []);
      setPaginationPages([]);
    } catch (error) {
      console.error(error);
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
      ) : (
        <div className="manwha-grid">
          {mangaData.map((manga, idx) => (
            <ManwhaCard key={`${manga.id}-${idx}`} manwha={manga} />
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

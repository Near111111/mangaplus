import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/MangaDetail.css";

interface MangaDetailData {
  id?: string;
  title?: string;
  name?: string;
  imageUrl?: string;
  author?: string;
  status?: string;
  updatedAt?: string;
  views?: string | number;
  genres?: string[] | string;
  rating?: string | number;
  chapterCount?: number;
  totalChapters?: number;
  lastChapter?: number;
  latestChapter?: string;
}

export default function MangaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manga, setManga] = useState<MangaDetailData | null>(null);
  const [reversed, setReversed] = useState(false);

  // Get latestChapter from location state (passed from ManwhaCard)
  const [latestChapterFromCard, setLatestChapterFromCard] =
    useState<string>("");

  useEffect(() => {
    // Check if there's latestChapter from location state
    if (location.state?.latestChapter) {
      setLatestChapterFromCard(location.state.latestChapter);
    } else if (id) {
      // Fallback to sessionStorage
      const stored = sessionStorage.getItem(`manga-${id}-latest`);
      if (stored) {
        setLatestChapterFromCard(stored);
      }
    }
  }, [location.state, id]);

  useEffect(() => {
    if (!id) return;

    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch manga details only
        const detailRes = await fetch(`/api/manga/${encodeURIComponent(id)}`);
        if (!detailRes.ok)
          throw new Error(`Failed to load manga: ${detailRes.statusText}`);
        const detailData: MangaDetailData = await detailRes.json();
        setManga(detailData);

        // If no latestChapter from card, try to get from API response
        if (!latestChapterFromCard) {
          const apiLatestChapter =
            detailData.latestChapter ||
            `chapter-${detailData.chapterCount}` ||
            `chapter-${detailData.totalChapters}` ||
            `chapter-${detailData.lastChapter}` ||
            "";
          if (apiLatestChapter && apiLatestChapter !== "chapter-undefined") {
            setLatestChapterFromCard(apiLatestChapter);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load manga");
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  if (loading) {
    return <div className="detail-page">Loading manga details...</div>;
  }

  if (error) {
    return <div className="detail-page error">{error}</div>;
  }

  // Extract chapter number from latestChapter string (e.g., "chapter-6" -> 6)
  const extractChapterNumber = (latestChapter: string): number => {
    if (!latestChapter) return 0;
    const match = latestChapter.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const totalChapters = extractChapterNumber(latestChapterFromCard);

  // Handle chapter click - navigate to reader
  const handleChapterClick = (chapterId: number) => {
    // Navigate using the same ID format used to access this page
    navigate(`/manga/${id}/read/${chapterId}`);
  };

  // Generate chapter list based on reversed state
  const displayedChapters = reversed
    ? Array.from({ length: totalChapters }, (_, index) => totalChapters - index)
    : Array.from({ length: totalChapters }, (_, index) => index + 1);

  return (
    <div className="detail-page">
      <div
        className="detail-banner"
        style={{
          backgroundImage: manga?.imageUrl
            ? `url(${manga.imageUrl})`
            : undefined,
        }}
      >
        <div className="detail-banner-overlay" />
        <div className="detail-banner-inner">
          <div className="detail-left">
            <img
              className="detail-cover"
              src={manga?.imageUrl}
              alt={manga?.title ?? manga?.name ?? id}
            />
          </div>
          <div className="detail-right">
            <div className="detail-title-box">
              <h1 className="detail-title">
                {manga?.title ?? manga?.name ?? id}
              </h1>
            </div>

            {/* Manga Information Section */}
            <div className="manga-info">
              <h3>INFORMATION</h3>
              <ul>
                {manga?.author && (
                  <li>
                    <strong>Author:</strong> {manga.author}
                  </li>
                )}
                {manga?.status && (
                  <li>
                    <strong>Status:</strong> {manga.status}
                  </li>
                )}
                {manga?.updatedAt && (
                  <li>
                    <strong>Last Updated:</strong> {manga.updatedAt}
                  </li>
                )}
                {manga?.views && (
                  <li>
                    <strong>Views:</strong> {manga.views.toLocaleString()}
                  </li>
                )}
                {manga?.genres && (
                  <li>
                    <strong>Genres:</strong>{" "}
                    {Array.isArray(manga.genres)
                      ? manga.genres.join(", ")
                      : manga.genres}
                  </li>
                )}
                {manga?.rating && (
                  <li>
                    <strong>Rating:</strong> {manga.rating}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="detail-chapters-area">
        <div className="chapters-heading">
          <h2>Chapters</h2>
          <button onClick={() => setReversed((prev) => !prev)}>
            {reversed ? "Undo reverse" : "Reverse order"}
          </button>
        </div>

        <div className="chapters-list">
          {totalChapters > 0 ? (
            displayedChapters.map((chapterId, idx) => (
              <div
                key={`chapter-${chapterId}-${idx}`}
                className="chapter-item"
                onClick={() => handleChapterClick(chapterId)}
              >
                <span>Chapter {chapterId}</span>
              </div>
            ))
          ) : (
            <p>No chapters available</p>
          )}
        </div>
      </div>
    </div>
  );
}

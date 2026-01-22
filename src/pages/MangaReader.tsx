import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton, Box } from "@mui/material";
import "../styles/MangaReader.css";

interface Page {
  img: string;
}

export default function MangaReader() {
  const { id, chapter } = useParams<{ id: string; chapter: string }>();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChapter = chapter ? parseInt(chapter) : 1;

  useEffect(() => {
    if (!id || !chapter) return;

    const fetchChapter = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/manga/${id}/${chapter}`);

        if (!res.ok) throw new Error("Chapter not found");

        const data = await res.json();

        console.log("API Response:", data);

        let pageData: Page[] = [];

        const possibleKeys = [
          "imageUrls",
          "images",
          "pages",
          "imageUrl",
          "imgs",
          "pictures",
          "imagesUrl",
          "chapter_images",
        ];

        for (const key of possibleKeys) {
          if (data[key] && Array.isArray(data[key])) {
            console.log(`Found images in property: ${key}`, data[key]);
            pageData = data[key]
              .map((item: string | { img?: string; url?: string }) => {
                if (typeof item === "string") {
                  return { img: item };
                } else if (item.img) {
                  return { img: item.img };
                } else if (item.url) {
                  return { img: item.url };
                }
                return { img: "" };
              })
              .filter((page: Page) => page.img);
            break;
          }
        }

        if (pageData.length === 0) {
          console.error(
            "Could not find images array. Full response:",
            JSON.stringify(data, null, 2),
          );
        }

        console.log("Processed pages:", pageData);
        setPages(pageData);

        if (pageData.length === 0) {
          setError("No pages found in this chapter");
        }
      } catch (err) {
        console.error("Chapter fetch error:", err);
        setError("Failed to load chapter");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, chapter]);

  const handlePrevious = () => {
    if (currentChapter > 1) {
      navigate(`/manga/${id}/read/${currentChapter - 1}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    navigate(`/manga/${id}/read/${currentChapter + 1}`);
    window.scrollTo(0, 0);
  };

  const handleBackToDetail = () => {
    navigate(`/manga/${id}`);
  };

  if (loading)
    return (
      <main className="reader-container">
        <div className="reader-header">
          <button onClick={handleBackToDetail} className="back-btn">
            ← Back to Details
          </button>
          <Skeleton
            variant="text"
            width={200}
            sx={{ background: "rgba(255, 107, 53, 0.15)" }}
          />
        </div>
        <div className="reader-pages">
          {Array.from(new Array(5)).map((_, index) => (
            <Box key={index} sx={{ width: "100%", mb: 0 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={600}
                sx={{
                  background: "rgba(255, 107, 53, 0.1)",
                  border: "1px solid rgba(255, 107, 53, 0.15)",
                }}
              />
            </Box>
          ))}
        </div>
      </main>
    );
  if (error) return <p className="reader-status reader-error">{error}</p>;
  if (pages.length === 0)
    return <p className="reader-status">No pages available</p>;

  return (
    <main className="reader-container">
      <div className="reader-header">
        <button onClick={handleBackToDetail} className="back-btn">
          ← Back to Details
        </button>
        <h2 className="chapter-title">Chapter {currentChapter}</h2>
      </div>

      <div className="reader-pages">
        {pages.map((p, i) => (
          <img
            key={`page-${i}`}
            src={p.img}
            alt={`Page ${i + 1}`}
            className="reader-page"
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load image ${i + 1}:`, p.img, e);
            }}
          />
        ))}
      </div>

      <div className="reader-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentChapter <= 1}
          className="nav-btn prev-btn"
        >
          ← Previous Chapter
        </button>
        <button onClick={handleNext} className="nav-btn next-btn">
          Next Chapter →
        </button>
      </div>
    </main>
  );
}

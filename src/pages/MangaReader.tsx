import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/MangaReader.css";

interface Page {
  img: string;
}

export default function MangaReader() {
  const { id } = useParams();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(`/api/read/${id}/chapter-1`);
        const data = await res.json();
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id]);

  if (loading) return <p>Loading chapter...</p>;

  return (
    <div className="reader-container">
      {pages.map((page, index) => (
        <img
          key={index}
          src={page.img}
          alt={`Page ${index + 1}`}
          className="reader-page"
        />
      ))}
    </div>
  );
}

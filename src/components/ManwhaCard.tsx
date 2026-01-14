import React from "react";
import { Link } from "react-router-dom";
import "../styles/ManwhaCard.css";

interface Manga {
  id: string;
  slug?: string;
  title: string;
  imgUrl: string;
  latestChapter?: string;
  latestChapters?: Array<{ name: string; chapter: string }>;
  description: string;
}

interface Props {
  manwha: Manga;
}

const ManwhaCard: React.FC<Props> = ({ manwha }) => {
  const identifier =
    manwha.slug && manwha.slug.trim() ? manwha.slug : manwha.id;

  let latestChapter = "";

  if (manwha.latestChapter) {
    latestChapter = manwha.latestChapter;
  } else if (manwha.latestChapters && manwha.latestChapters.length > 0) {
    const chapterNum = manwha.latestChapters[0].chapter;
    latestChapter = `chapter-${chapterNum}`;
  }

  const displayText =
    manwha.latestChapter || manwha.latestChapters?.[0]?.name || "No chapters";

  // Store latestChapter in sessionStorage when clicking
  const handleClick = () => {
    if (latestChapter) {
      sessionStorage.setItem(`manga-${identifier}-latest`, latestChapter);
    }
  };

  return (
    <Link
      to={`/manga/${encodeURIComponent(identifier)}`}
      state={{ latestChapter }}
      className="manwha-card"
      onClick={handleClick}
    >
      <div className="card-image-container">
        <img src={manwha.imgUrl} alt={manwha.title} className="card-image" />
        <div className="card-overlay">
          <p className="latest-episode">{displayText}</p>
        </div>
      </div>

      <h3 className="card-title">{manwha.title}</h3>
    </Link>
  );
};

export default ManwhaCard;

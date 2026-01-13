import React from "react";
import "../styles/ManwhaCard.css";

interface Manga {
  id: string;
  title: string;
  imgUrl: string;
  latestChapter: string;
  description: string;
}

interface ManwhaCardProps {
  manwha: Manga;
}

const ManwhaCard: React.FC<ManwhaCardProps> = ({ manwha }) => {
  return (
    <div className="manwha-card">
      <div className="card-image-container">
        <img src={manwha.imgUrl} alt={manwha.title} className="card-image" />
        <div className="card-overlay">
          <div className="card-info">
            {manwha.latestChapter && (
              <p className="latest-episode">{manwha.latestChapter}</p>
            )}
          </div>
        </div>
      </div>
      <h3 className="card-title">{manwha.title}</h3>
    </div>
  );
};

export default ManwhaCard;

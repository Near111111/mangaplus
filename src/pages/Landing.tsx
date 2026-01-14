import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Lock scroll when landing page mounts
    document.body.style.overflow = "hidden";

    // Unlock scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleStartReading = () => {
    navigate("/home");
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo">
          <h1 className="landing-title">
            <span className="go-text">MANGA</span>
            <span className="manga-text">PLUS</span>
          </h1>
          <p className="landing-subtitle">Your Gateway to Unlimited Manga</p>
        </div>

        <button className="start-reading-btn" onClick={handleStartReading}>
          Start Reading
        </button>
      </div>
    </div>
  );
}

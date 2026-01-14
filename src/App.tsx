import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import MangaDetail from "./pages/MangaDetail";
import MangaReader from "./pages/MangaReader";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Landing Page - No Header */}
        <Route path="/" element={<Landing />} />

        {/* Main App Routes - With Header */}
        <Route
          path="/home"
          element={
            <>
              <Header />
              <main className="page-container">
                <Home />
              </main>
            </>
          }
        />

        <Route
          path="/manga/:id"
          element={
            <>
              <Header />
              <main className="page-container">
                <MangaDetail />
              </main>
            </>
          }
        />

        <Route path="/manga/:id/read/:chapter" element={<MangaReader />} />
      </Routes>
    </div>
  );
}

export default App;

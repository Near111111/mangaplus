import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import MangaReader from "./pages/MangaReader";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<MangaReader />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

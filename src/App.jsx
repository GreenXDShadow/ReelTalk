// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieCatalog from "./pages/MovieCatalog"; 
import MoviePage from "./pages/MoviePage";
import UserCatalog from "./pages/UserCatalog";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviecatalog" element={<MovieCatalog />} /> 
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/usercatalog" element={<UserCatalog />} />
      </Routes>
    </Router>
  );
}

export default App;

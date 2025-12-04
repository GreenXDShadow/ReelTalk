import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieCatalog from "./pages/MovieCatalog"; 
import MoviePage from "./pages/MoviePage";
import UserCatalog from "./pages/UserCatalog";
import HistoryPage from './pages/HistoryPage';
import AdminPage from "./pages/AdminPage";
import AdminPage from "./pages/AdminPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviecatalog" element={<MovieCatalog />} /> 
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/usercatalog" element={<UserCatalog />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/admin" element={<AdminPage />} />


      </Routes>
    </Router>
  );
}

export default App;

import { Link } from "react-router-dom";
import "./Navbar.css"; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">ReelTalk</div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/moviecatalog">Movies</Link></li>
        <li><Link to="/usercatalog">Users</Link></li>
      </ul>
    </nav>
  );
}

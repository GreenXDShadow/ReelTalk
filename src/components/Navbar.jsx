import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import hook
import "../css/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">ReelTalk</div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/moviecatalog">Movies</Link></li>
        <li><Link to="/usercatalog">Users</Link></li>
      </ul>

      {/* Right side Auth Section */}
      <div style={{ marginLeft: "auto", display: "flex", gap: "15px", alignItems: "center" }}>
        {user ? (
          <>
            <span style={{ color: "white" }}>Welcome, {user.username}</span>
            <button 
              onClick={logout}
              style={{ padding: "5px 10px", fontSize: "0.8rem", backgroundColor: "#d9534f" }}
            >
              Logout
            </button>
          </>
        ) : (
          <span style={{ color: "#ccc", fontStyle: "italic" }}>Guest</span>
        )}
      </div>
    </nav>
  );
}
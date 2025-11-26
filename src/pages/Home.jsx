import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
        <Navbar />
      <h1>Welcome to ReelTalk</h1>
      <h2>For people who want to make a statement</h2>

      <button onClick={() => navigate("/moviecatalog")}>See available movies</button>
    </>
  );
}

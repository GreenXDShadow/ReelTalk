import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from "../apiService";
import NavBar from "../components/Navbar";
import TransactionAddButton from "../components/TransactionAddButton";
import TransactionDeleteButton from "../components/TransactionDeleteButton";
import "../css/MoviePage.css";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null); // single movie
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const data = await getMovieById(id);
      setMovie(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setMovie(null);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <div className="movieContainer">
      <NavBar />

      <div className="movieDiv">
        <img 
      src={movie.image_link} 
      alt={movie.title} 
      style={{ maxWidth: "100%", height: "auto", borderRadius: "5px" }} 
    />
      </div>
      <div className="movieDiv">
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>
        <TransactionAddButton movieId={movie.id} transactionType="rent"/>
        <TransactionAddButton movieId={movie.id} transactionType="buy"/>
        <TransactionDeleteButton movieId={movie.id}/>
      </div>
    </div>
  );
}

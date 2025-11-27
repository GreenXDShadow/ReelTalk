import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from '../apiService';
import NavBar from "../components/Navbar";

export default function MoviePage() {
  const {id} = useParams();
  const [movie, setMovie] = useState(null); // single movie
  const [error, setError] = useState(''); 

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const data = await getMovieById(id);
      setMovie(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setMovie(null);
    } 
  };

  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <div>
          <NavBar />
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
    </div>
  );
}

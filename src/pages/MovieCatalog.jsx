import NavBar from "../components/Navbar";
import MovieList from '../components/MovieList';

export default function Home() {
  return (
    <>
      <NavBar />
      <h1>Movies Available</h1>
      <MovieList />
    </>
  );
}

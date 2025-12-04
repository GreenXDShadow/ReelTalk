import NavBar from "../components/Navbar";
import MovieList from '../components/MovieList';

export default function MovieCatalog() {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
          width: "100vw",  
          paddingTop: "300px"
        }}
      >
      <h1>Movies Available</h1>
      <MovieList />
      </div>
    </>
  );
}

import NavBar from "../components/Navbar";
import EditMovieList from '../components/EditMovieList';

export default function MovieCatalog() {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", 
          height: "100vh", 
          width: "100vw",  
          paddingTop: "1600px"
        }}
      >
      <h1>Movies Available</h1>
      <EditMovieList />
      </div>
    </>
  );
}

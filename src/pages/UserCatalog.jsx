import NavBar from "../components/Navbar";
import UserList from '../components/UserList';

export default function Home() {
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
      <h1>Current Users</h1>
      <UserList />
      </div>
    </>
  );
}

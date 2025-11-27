import NavBar from "../components/Navbar";
import UserList from '../components/UserList';

export default function Home() {
  return (
    <>
      <NavBar />
      <h1>Current Users</h1>
      <UserList />
    </>
  );
}

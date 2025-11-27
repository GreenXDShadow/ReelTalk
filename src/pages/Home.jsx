import Navbar from "../components/Navbar";
import UserForm from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Home() {


  const [users, setUsers] = useState([]); //stores list of users
    const [error, setError] = useState(""); //any errors go here
  const fetchUsers = async () => {
      //we call this whenever we need to call api for getUsers
      try {
        const userdata = await getUsers(); //let api get the users
        setUsers(userdata); //save the response
        setError(""); //no error
      } catch (err) {
        //smth went wrong so
        setError(err.message); //save error in error
      }
    };

  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "90vw",
          left: "50%",
          top: "0%",
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/023/341/569/non_2x/film-reel-on-the-bright-orange-background-vector.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "sticky",
          zIndex: "-1000",
          marginTop: "-75vh"
        }}
      ></div> {/* sorry ik this is bad lol */}
      
      <Navbar />
      <h1>Welcome to ReelTalk</h1>
      <h2>For people who want to make a statement</h2>
      <div
        className="buttons"
        style={{ display: "flex", gap: "10px", justifyContent: "center" }}
      >
        <button onClick={() => navigate("/moviecatalog")}>
          See available movies
        </button>
        <button
          onClick={() => document.getElementById("userForm").scrollIntoView()}
        >
          Sign up
        </button>
      </div>
      <div style={{ height: "300px" }}></div>
      <div id="userForm">
        <UserForm onSuccess={fetchUsers /* on success, getUsers */} /> 
      </div>
      <div style={{ height: "300px" }}></div>
    </>
  );
}

import Navbar from "../components/Navbar";
import UserForm from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../css/Home.css";

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
      <div className="background-container"></div>

      <Navbar />
      <h1 className="home-title">Welcome to ReelTalk</h1>
      <h2 className="home-subtitle">For people who want to make a statement</h2>

      <div className="button-container">
        <button onClick={() => navigate("/moviecatalog")}>
          See available movies
        </button>
        <button
          onClick={() => document.getElementById("userForm").scrollIntoView()}
        >
          Sign up
        </button>
      </div>

      <div className="spacer"></div>

      <div id="userForm">
        <UserForm onSuccess={fetchUsers /* on success, getUsers */} />
      </div>

      <div className="spacer"></div>
    </>
  );
}

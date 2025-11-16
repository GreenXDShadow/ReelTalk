//This is the list of users for display
import React, { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser } from "../apiService";
import UserForm from "./UserForm";

function UserList() {
  const [users, setUsers] = useState([]); //stores list of users
  //const [editingUser, setEditingUser] = useState(null); //stores current user we're editing //ill do it later
  const [error, setError] = useState(""); //any errors go here

  useEffect(() => {
    fetchUsers();
  }, []); //on load, fetch the users so far

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

  return (
    //the actual component
    <div>
      <h2>User Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* actual creation form will go here */}
      <UserForm onSuccess={fetchUsers /* on success, getUsers */} /> 

      <h3>Available Users</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(
          (
            user //make a div for each user
          ) => (
            <li
              key={user.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <img
                src={user.image_link || "https://via.placeholder.com/100x150"}
                alt={user.username}
                style={{ width: "100px", float: "left", marginRight: "10px" }}
              />
              <h4>{user.username}</h4>
              <p>{user.date_account_created}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default UserList;

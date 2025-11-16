import React, { useState, useEffect } from "react";

function UserForm({ onSuccess }) {
  const [formData, setFormData] = useState({ //form to submit 
    id: "",
    username: "",
    date_account_created: "",
    image_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; //name is the what was changed, value is what it was changed to
    setFormData((prev) => ({ ...prev, [name]: value })); //update form
  };

  const handleSubmit = async (e) => { //onsubmit
    e.preventDefault();

    try {
      const api = await import("../apiService"); //get the api
      await api.createUser(formData); // call createuser function in api.py
      onSuccess();  //if it works
      setFormData({ //then reset form
        id: "",
        username: "",
        date_account_created: "",
        image_link: "",
      });
    } catch (error) {
      console.error("Failed to save user:", error); //else smth happened LOL
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Add new user</h3>
      <input
        type="text"
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date_account_created"
        value={formData.date_account_created}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="image_link"
        placeholder="pfp link"
        value={formData.image_link}
        onChange={handleChange}
        required
      />
      <button type="submit">create</button>
    </form>
  );
}

export default UserForm;

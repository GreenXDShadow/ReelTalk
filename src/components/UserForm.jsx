import React, { useState, useEffect } from "react";
import "../css/UserForm.css";

function UserForm({ onSuccess }) {
  const [formData, setFormData] = useState({ //form to submit 
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
        username: "",
        date_account_created: "",
        image_link: "",
      });
    } catch (error) {
      console.error("Failed to save user:", error); //else smth happened LOL
    }
  };

  return (
    <div className="SignUpForm">
      <form onSubmit={handleSubmit}>
        <h2>Sign up today!</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="SignUpFormInput"
        />
        <br/>
        <input
          type="date"
          name="date_account_created"
          value={formData.date_account_created}
          onChange={handleChange}
          required
          className="SignUpFormInput"
        />
        <br/>
        <input
          type="text"
          name="image_link"
          placeholder="Upload image"
          value={formData.image_link}
          onChange={handleChange}
          required
          className="SignUpFormInput"
        />
        <br/>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default UserForm;
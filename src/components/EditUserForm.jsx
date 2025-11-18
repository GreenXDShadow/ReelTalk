import React, { useState, useEffect } from "react";

function EditUserForm({ user, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    image_link: "",
  });

  // Prefill inputs when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        image_link: user.image_link,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px" }}>
      <h3>Edit User</h3>

      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input 
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <br />

        <label>Image URL:</label>
        <input 
          name="image_link"
          value={formData.image_link}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Save Changes</button>
        <button 
          type="button" 
          onClick={onCancel} 
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditUserForm;

import React, { useState } from "react";
import { createUser } from "../apiService"; // Import directly
import { useAuth } from "../context/AuthContext";
import "../css/UserForm.css";

function UserForm({ onSuccess }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login/Signup

  const [formData, setFormData] = useState({
    username: "",
    password: "", // Added password
    image_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Handle Login
        const result = await login(formData.username, formData.password);
        if (result.success) {
           alert("Logged in!");
           setFormData({ username: "", password: "", image_link: "" });
        } else {
           alert("Login failed");
        }
      } else {
        // Handle Signup
        await createUser(formData);
        onSuccess && onSuccess(); // Refresh user list if provided
        alert("Account created! Please log in.");
        setIsLogin(true); // Switch to login view
      }
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="SignUpForm">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign up today!"}</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="SignUpFormInput"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="SignUpFormInput"
        />

        {/* Hide Image Link during Login */}
        {!isLogin && (
          <input
            type="text"
            name="image_link"
            placeholder="Image URL (Optional)"
            value={formData.image_link}
            onChange={handleChange}
            className="SignUpFormInput"
          />
        )}

        <button type="submit">{isLogin ? "Login" : "Create Account"}</button>

        <p style={{textAlign: "center", color: "white", marginTop: "10px", cursor: "pointer"}}
           onClick={() => setIsLogin(!isLogin)}>
           {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}

export default UserForm;
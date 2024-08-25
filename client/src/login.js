import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./login.css"; // Assuming you have a CSS file for styling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    Axios.post("http://localhost:3001/login", {
      userID: username,
      entryPass: password,
    })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("username", username); // Store username to persist login
          navigate("/password-manager");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  const handleSignup = () => {
    Axios.post("http://localhost:3001/signup", {
      userID: username,
      entryPass: password,
    })
      .then((response) => {
        if (response.data.success) {
          alert("Signup successful! Click on the log in button to log in.");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <>
      <video autoPlay muted loop id="backgroundVideo">
        <source src="/websiteBackground.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-container">
        <h2>Login / Signup</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Signup</button>
      </div>
    </>
  );
}

export default Login;

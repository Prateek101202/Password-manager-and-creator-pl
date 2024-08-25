import React from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import ShowSavedPasswords from "./ShowSavedPasswords";
import PasswordGenerator from "./PasswordGenerator";
import Login from "./login";
import "./App.css";
import Axios from "axios";

function PasswordManager() {
  const [password, setPassword] = React.useState("");
  const [title, setTitle] = React.useState("");
  const username = localStorage.getItem("username"); // Retrieve username
  const navigate = useNavigate(); // Initialize navigate here

  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      title: title,
      userID: username,
    })
      .then(() => {
        setPassword("");
        setTitle("");
        alert("Password added successfully!");
      })
      .catch((error) => {
        console.error("Error adding password:", error);
        alert("An error occurred while adding the password. Please try again later.");
      });
  };


  const handleLogout = () => {
    // let ans=confirm("Are you sure you want to log out?");
    // if (ans) {
      localStorage.removeItem("username");
      navigate("/login"); // Use navigate to redirect to the login page
    // }
  };

  return (
    <>
      <video autoPlay muted loop id="backgroundVideo">
        <source src="/websiteBackground.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="App">
        <div className="AddingPassword">
          <div className="Title">
            <h3>Enter the password and the designation</h3>
          </div>
          <input
            type="text"
            placeholder="Ex. password123"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="text"
            placeholder="Ex. Facebook"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button onClick={addPassword}>Add Password</button>
          <Link to="/show-saved-passwords">
            <button>Show Saved Passwords</button>
          </Link>
          <Link to="/create-strong-password">
            <button>Create Password</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  React.useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/password-manager" element={<PasswordManager />} />
      <Route path="/show-saved-passwords" element={<ShowSavedPasswords />} />
      <Route path="/create-strong-password" element={<PasswordGenerator />} />
    </Routes>
  );
}

export default App;

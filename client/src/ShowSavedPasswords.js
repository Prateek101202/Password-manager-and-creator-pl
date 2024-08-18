import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import './ShowSavedPasswords.css'
function ShowSavedPasswords() {
  const [passwords, setPasswords] = useState([]);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswords = async () => {
        try {
          const userID = localStorage.getItem('username');
          const response = await Axios.get(`http://localhost:3001/passwords/${userID}`);
          
          if (response.data.success) {
            setPasswords(response.data.passwords);
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching passwords:', error);
          alert("An error occurred while fetching passwords.");
        }
      };
    
      fetchPasswords();
  }, [username]);
  

  const deletePassword = (id) => {
    if (!id) {
      console.error('ID is not defined');
      return;
    }
  
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this password?");
    
    if (confirmDelete) {
      // Proceed with deletion if confirmed
      Axios.delete(`http://localhost:3001/deletepassword/${id}`)
        .then((response) => {
          if (response.data.success) {
            // Update the local state to remove the deleted password
            setPasswords((prevPasswords) => prevPasswords.filter((password) => password.ID !== id));
          } else {
            alert(response.data.message); // Show backend error message if any
          }
        })
        .catch((error) => {
          console.error("Error deleting password:", error.message); // Log the error message
          alert("An error occurred while deleting the password. Please try again later.");
        });
    } else {
      // User canceled the deletion
      console.log("Password deletion canceled.");
    }
  };
  
  
  
  



  return (
    <div className="ShowSavedPasswords">
      <h2>Saved Passwords</h2>
      {passwords.length > 0 ? (
        passwords.map((password) => (
          <div key={password.ID} className="passwordItem">
            <p>Title: {password.title}</p>
            <p>Password: {password.password}</p>
            <button onClick={() => deletePassword(password.ID)}>Delete</button>

          </div>
        ))
      ) : (
        <p>No saved passwords found.</p>
      )}
      <button onClick={() => navigate("/password-manager")}>Go Back to Main Page</button>
    </div>
  );
}

export default ShowSavedPasswords;

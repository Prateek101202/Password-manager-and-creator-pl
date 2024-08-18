const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MySQL connection pool setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your database username
  password: 'mysqlpassword', // Replace with your database password
  database: 'PasswordManager', // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Login route
app.post('/login', async (req, res) => {
  const { userID, entryPass } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE userID = ? AND entryPass = ?', [userID, entryPass]);

    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  const { userID, entryPass } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);

    if (existingUser.length > 0) {
      res.json({ success: false, message: "User already exists. Please Log in." });
    } else {
      await pool.query('INSERT INTO users (userID, entryPass) VALUES (?, ?)', [userID, entryPass]);
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Add Password route
app.post('/addpassword', async (req, res) => {
  const { password, title, userID } = req.body;

  if (!password || !title || !userID) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const newPassword = {
    //   id: uuidv4(),
      password,
      title,
      userID
    };

    await pool.query('INSERT INTO passwords (ID, password, title, userID) VALUES (?, ?, ?, ?)', [newPassword.id, newPassword.password, newPassword.title, newPassword.userID]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding password:', error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Get Passwords route
app.get('/passwords/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM passwords WHERE userID = ?', [userID]);

    if (rows.length > 0) {
      res.json({ success: true, passwords: rows });
    } else {
      res.json({ success: false, message: "No passwords found" });
    }
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Delete Password route
// Delete Password route
app.delete('/deletepassword/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to delete password with ID: ${id}`);
    
    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }
    
    try {
      const [result] = await pool.query('DELETE FROM passwords WHERE ID = ?', [id]);
      console.log(`Delete result: ${JSON.stringify(result)}`);
      
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Password not found" });
      }
    } catch (error) {
      console.error('Error deleting password:', error); // Log the full error object
      res.status(500).json({ success: false, message: "An error occurred while deleting the password." });
    }
  });
  
  
  
  

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

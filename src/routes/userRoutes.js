const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Import the user model
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register'); // Renders the register.ejs file
});

router.get('/login', (req, res) => {
  res.render('login'); // Renders the login.ejs file
});

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, age, location, phoneNumber } = req.body;

  try {
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      age,
      location,
      phoneNumber,
      dogInfo: {
        name: "Buddy", // Example static dog data
        breed: "Golden Retriever",
        age: 4,
        weight: 30,
        temperament: "Friendly"
      }
    });

    await newUser.save();
    res.redirect('/login'); // Redirect to login page or wherever appropriate after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// POST request to handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Store user info in session (you can store more info as needed)
    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
    };

    res.send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Example route to check if the user is logged in
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('You are not logged in');
  }

  res.send(`Welcome ${req.session.user.firstName}`);
});

// Route to log out the user
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.send('Logged out successfully');
  });
});

module.exports = router;
const express = require('express');
const UserLogin = require('../models/userModel');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(String('your-secret-key')).digest('base64').substr(0, 32);
const iv = crypto.createHash('sha256').update(String('your-fixed-iv')).digest('base64').substr(0, 16);

// Sample route
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    const user = new UserLogin({
      firstName,
      lastName,
      email,
      password
      
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });

  }
});
// login 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserLogin.findOne({ email, password });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, secretKey, { expiresIn: '3000s' });
    const id = user._id.toString()
    // Return token and other data
    return res.status(200).json({
      message: "Login successful",
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      id,
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
})
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Welcome to the User API!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());



// Import Routers
const userRouter = require('./routes/userRouter');
const profileRouter = require('./routes/profileRouter');
const emailRouter = require('./routes/emailFormRouters');
const hrDataRouter= require('./routes/hrDataRouter');
const mailSender = require('./routes/mailSender');

// Routes
app.use(userRouter);
app.use(profileRouter);
app.use(emailRouter);
app.use(hrDataRouter);
app.use(mailSender);

// Connect to MongoDB
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

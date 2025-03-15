const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Connect to MongoDB if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Project schema (if using MongoDB)
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  technologies: [String],
  liveUrl: String,
  githubUrl: String,
  featured: Boolean,
  order: Number
});

const Project = mongoose.model('Project', projectSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to get all projects
app.get('/api/projects', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      // If not connected to MongoDB, return sample data
      return res.json(require('./data/projects.json'));
    }
    
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact form submission handler
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message' });
  }
  
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject || 'New message'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Respond to client
    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
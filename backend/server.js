import dotenv from 'dotenv';
dotenv.config(); 
import { sendOtpEmail } from './src/services/emailService.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Notes from './src/models/notes.js';
import User from './src/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './src/middleware/auth.js'; // Adjust path as needed


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static('./src/assets'));
app.use(cors({
  origin: "https://notes-app-1exy.onrender.com/", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
}));

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
const JWT_SECRET = process.env.JWT_SECRET;


app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingVerifiedUser = await User.findOne({ email, isVerified: true });
    if (existingVerifiedUser) {
      return res.status(400).json({ error: 'Email already in use by a verified account' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    
    let user = await User.findOneAndUpdate(
      { email, isVerified: false },
      { name, password: hashedPassword, otp, otpExpires, isVerified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/notes/:id', authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id; // user id from token
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: "Please provide a title or description to update" });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated note and run validators
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found or you do not have permission to edit it" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});


app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear OTP fields
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully. Please log in.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
    console.log("Secret used for SIGNING token in /login:", process.env.JWT_SECRET); // <-- ADD THIS LINE
  console.log("Login request body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log("1. TOKEN CREATED ON BACKEND:", token); // <-- ADD THIS LINE


    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/notes/:id', authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id; 

    const deletedNote = await Notes.findOneAndDelete({ _id: noteId, user: userId });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found or you do not have permission to delete it" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.get("/test", (req, res) => {
  console.log("✅ /test route was successfully reached!");
  res.send("Hello from the backend!");
});


app.post('/notes', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const userId = req.user.id;

    const note = new Notes({
      title,
      description,
      user: userId
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/notes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Notes.find({ user: userId }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

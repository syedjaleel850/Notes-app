// src/routes/notes.routes.ts
import express from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notes.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').delete(protect, deleteNote);

export default router;

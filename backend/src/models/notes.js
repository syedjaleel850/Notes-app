//./models/notes.js
import mongoose from 'mongoose'

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create index for faster queries
notesSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Notes', notesSchema);
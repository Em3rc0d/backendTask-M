const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    priority: { type: String, enum: ['Baja', 'Media', 'Alta'], default: 'Media' },
    userId: { type: String, required: true }, // ID del usuario
    subtasks: [{ title: String, completed: { type: Boolean, default: false } }],
    status: { type: String, enum: ['To Do', 'Doing', 'Done'], default: 'To Do' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

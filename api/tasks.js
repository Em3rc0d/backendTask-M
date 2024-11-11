const express = require('express');
const Task = require('../models/Task');
const { response } = require('../app');

const router = express.Router();

router.get('/1', async (req, res) => {
    res.send('hola');
});


router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Crear una nueva tarea
router.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).send(newTask);
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener tareas por ID de usuario
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.send(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener tareas por Gmail
router.get('/:email', async (req, res) => {
    try {
        const tasks = await Task.find({ email: req.params.email });
        res.send(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Actualizar una tarea
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.send(updatedTask);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:email', async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.send(updatedTask);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.status(204).send(); // No hay contenido que devolver
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:email', async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ email: req.params.email });
        if (!deletedTask) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.status(204).send(); // No hay contenido que devolver
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router; // Exporta las rutas

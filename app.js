const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRoute = require('./api/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/tasks', tasksRoute);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});

module.exports = app; // Exporta la aplicación para que pueda ser utilizada en server.js

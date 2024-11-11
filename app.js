const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRoute = require('./api/tasks');
require('dotenv').config(); // Para cargar las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
const mongoUri = process.env.MONGODB_URI;
const weatherApiKey = process.env.WEATHER_API_KEY;

let isConnected = false; // Variable para almacenar el estado de la conexión

async function connectToDatabase() {
    if (isConnected) {
        console.log("Conexión a MongoDB ya está establecida.");
        return;
    }
    try {
        const db = await mongoose.connect(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000 // Tiempo máximo de espera de 5 segundos
        });
        isConnected = db.connections[0].readyState === 1; // 1 significa conectado
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
    }
}

// Llamada inicial para establecer la conexión
connectToDatabase();

// Rutas
app.get('/', (req, res) => {
    res.send('API de tareas');
});

app.use('/tasks', tasksRoute);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});

app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el clima' });
    }
  });

module.exports = app; // Exporta la aplicación para que pueda ser utilizada en server.js

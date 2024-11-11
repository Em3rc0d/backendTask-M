const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { router: authRouter, authenticateJWT } = require("./api/auth");
const tasksRoute = require("./api/tasks");
require("dotenv").config(); // Para cargar las variables de entorno

const app = express();
app.use(
  cors({
    origin: "https://backend-task-m.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Conectar a la base de datos
const mongoUri = process.env.MONGODB_URI;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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
      serverSelectionTimeoutMS: 20000, // Tiempo máximo de espera de 5 segundos
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
app.get("/", (req, res) => {
  res.send("API de tareas");
});

// Rutas
app.use("/auth", authRouter); // Ruta de autenticación

// Protege las rutas de tareas con JWT
app.use("/tasks", authenticateJWT, tasksRoute);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).send("Error interno del servidor");
});

module.exports = app; // Exporta la aplicación para que pueda ser utilizada en server.js

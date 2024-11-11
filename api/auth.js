const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Función para generar el JWT
function generateJWT(user) {
    // Crea el payload con la información del usuario que quieres incluir en el token
    const payload = {
        userId: user._id,
        email: user.email
    };
    
    // Genera el token con el payload y una clave secreta
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return token;
}

// Registro de un usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const newUser = new User({ email, password });
        await newUser.save();
        console.log('Email:', email);
        console.log('Contraseña proporcionada:', password);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});


// Login del usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        console.log('Contraseña proporcionada:', password);
        console.log('Contraseña encriptada:', user.password);

        if (password !== user.password) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        // Si la contraseña es correcta, generar un JWT o lo que corresponda
        const token = generateJWT(user); // Función para generar el JWT
        return res.json({ token });

    } catch (err) {
        console.error('Error al autenticar usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Middleware para verificar el token
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(403).json({ error: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
}

module.exports = { router, authenticateJWT };
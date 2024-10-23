const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); // Importa la aplicación Express

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

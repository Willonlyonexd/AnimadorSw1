require('dotenv').config();  // Esto carga las variables de entorno desde el archivo .env

const express = require('express');
const bodyParser = require('body-parser');
const audioRoutes = require('./routes/audioRoutes');  // Importamos las rutas de audio

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Registrar las rutas de audio
app.use('/api/audio', audioRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

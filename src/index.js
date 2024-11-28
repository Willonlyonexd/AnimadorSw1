const express = require('express');
const bodyParser = require('body-parser');
const audioRoutes = require('./routes/audioRoutes'); // Asegúrate de que esta ruta esté correcta

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/audio', audioRoutes);  // Definiendo la ruta /api/audio para audioRoutes

app.get('/api/health', (req, res) => {
  res.status(200).send('API is working!');
});
// Puerto dinámico asignado por Vercel
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo');
});

const express = require('express');
const router = express.Router();
const { generarAudioSala } = require('../controllers/audioController'); // Asegúrate de que la ruta sea correcta

// Ruta para generar y subir el audio
router.post('/generarAudio', generarAudioSala);  // Aquí se maneja la ruta POST

module.exports = router;

const express = require('express');
const router = express.Router();
const { generarAudioSala } = require('../controllers/audioController');

// Ruta para generar y subir el audio
router.post('/generarAudio', generarAudioSala);

module.exports = router;

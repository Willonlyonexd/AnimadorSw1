const googleTTS = require('google-tts-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinary');

// Función para generar y subir el audio
const generarAudio = async (texto) => {
  try {
    // Generar la URL del audio usando Google TTS
    const audioUrl = googleTTS.getAudioUrl(texto, {
      lang: 'es',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Descargar el audio
    const audioPath = path.join(__dirname, '../../temp/audio.mp3');
    const writer = fs.createWriteStream(audioPath);
    const response = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(writer);

    // Esperar a que se guarde el archivo de audio
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // Subir el archivo de audio a Cloudinary
          const result = await cloudinary.uploader.upload(audioPath, { resource_type: 'auto' });
          // Borrar archivo local después de subirlo
          fs.unlinkSync(audioPath);
          resolve(result.secure_url);
        } catch (error) {
          reject(error);
        }
      });

      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error('Error al generar y subir el audio: ' + error.message);
  }
};

module.exports = { generarAudio };

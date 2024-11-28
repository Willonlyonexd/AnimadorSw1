const googleTTS = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;  // Asegúrate de que tienes el paquete `cloudinary` instalado

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para generar el archivo de audio
function generarAudio(texto, archivoDestino) {
  return new Promise((resolve, reject) => {
    // Usamos el método googleTTS.getAudioUrl para obtener la URL del audio
    const url = googleTTS.getAudioUrl(texto, {
      lang: 'es',             // Idioma español
      slow: false,            // Velocidad normal
      host: 'https://translate.google.com',
      speed: 1.0              // Velocidad de habla, puedes ajustarlo para hacerlo más rápido o lento
    });

    if (!url) {
      return reject('No se pudo generar la URL del audio');
    }

    // Descargar el audio
    const file = fs.createWriteStream(archivoDestino);
    const request = require('https').get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
        resolve(archivoDestino);  // Retorna la ruta del archivo generado
      });
    });

    request.on('error', function(err) {
      reject(err);  // En caso de error en la descarga
    });
  });
}

// Función para subir el archivo a Cloudinary
function subirACloudinary(rutaArchivo) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(rutaArchivo, { resource_type: "auto" }, function(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);  // Retorna la URL segura del archivo en Cloudinary
      }
    });
  });
}

// Controlador para generar el audio y subirlo a Cloudinary
async function generarAudioSala(req, res) {
  const { texto } = req.body;  // Recibe el texto desde la solicitud (por ejemplo, desde Flutter)
  const archivoDestino = path.join(__dirname, '../../temp', 'audio.mp3');  // Ruta al archivo de audio temporal

  if (!texto) {
    return res.status(400).json({ error: 'El texto es obligatorio' });
  }

  try {
    // 1. Generar el archivo de audio
    const archivoGenerado = await generarAudio(texto, archivoDestino);

    // 2. Subir el archivo a Cloudinary
    const urlAudio = await subirACloudinary(archivoGenerado);

    // 3. Enviar la URL del archivo generado
    res.status(200).json({ url: urlAudio });

    // Eliminar archivo temporal
    fs.unlinkSync(archivoGenerado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando o subiendo el audio' });
  }
}

module.exports = { generarAudioSala };
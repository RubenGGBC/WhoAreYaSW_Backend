const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para las imágenes de Pokémon
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/pokemon');
  },
  filename: (req, file, cb) => {
    // El nombre del archivo será el ID del Pokémon
    // Si estamos creando un Pokémon, usaremos un nombre temporal
    // que luego se renombrará cuando tengamos el ID
    const pokemonId = req.params.id || req.body.id || Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${pokemonId}.png`);
  }
});

// Filtro para validar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF).'), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;


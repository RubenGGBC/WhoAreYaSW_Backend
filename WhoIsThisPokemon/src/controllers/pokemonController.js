const Pokemon = require('../models/Pokemon');
const fs = require('fs');
const path = require('path');

// Para el sistema de filtros, escapar caracteres especiales en regex
function escapeRegex(input) {
    return String(input).replace(/[.*+?^${}()[\]\\]/g, '\\$&');
}

// Lista paginada de Pokémon (público)
exports.getPokemon = async (req, res) => {
  try {
    const pageRaw = parseInt(req.query.page);
    const limitRaw = parseInt(req.query.limit);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Búsqueda por nombre
    if (req.query.search) {
      const q = String(req.query.search).trim();
      if (q) {
        filter.name = { $regex: escapeRegex(q), $options: 'i' };
      }
    }

    // Filtrado por tipo
    if (req.query.type) {
      const t = String(req.query.type).trim();
      if (t) {
        filter.$or = [
          { type1: { $regex: `^${escapeRegex(t)}$`, $options: 'i' } },
          { type2: { $regex: `^${escapeRegex(t)}$`, $options: 'i' } }
        ];
      }
    }

    const pokemon = await Pokemon.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ id: 1 });

    const total = await Pokemon.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: pokemon,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      message: 'Pokémon obtenidos exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_POKEMON_ERROR',
        message: error.message
      }
    });
  }
};

// Obtiene un Pokémon por Mongo _id o por campo numérico id (público)
exports.getPokemonById = async (req, res) => {
  try {
    const { id } = req.params;

    let pokemon = null;

    // Si es numérico, buscamos por el campo "id" primero (pokedex id)
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      pokemon = await Pokemon.findOne({ id: numericId });
    }

    // Si no es numérico o no se encontró, intentar por _id
    if (!pokemon) {
      pokemon = await Pokemon.findById(id).catch(() => null);
    }

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POKEMON_NOT_FOUND',
          message: 'Pokémon no encontrado'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: pokemon,
      message: 'Pokémon obtenido correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_POKEMON_BY_ID_ERROR',
        message: error.message
      }
    });
  }
};

// Crear Pokémon (admin)
exports.createPokemon = async (req, res) => {
  try {
    const { id, name, type1, type2, imageUrl } = req.body;
    const errors = [];

    // Validar id
    if (!id) {
      errors.push('El ID del Pokémon es requerido');
    } else if (typeof id !== 'number' && isNaN(id)) {
      errors.push('El ID debe ser un número');
    }

    // Validar nombre
    if (!name) {
      errors.push('El nombre es requerido');
    } else if (name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar type1
    if (!type1) {
      errors.push('El tipo 1 es requerido');
    }

    // Retornar errores si existen
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          details: errors
        }
      });
    }

    // Verificar si el Pokémon ya existe
    const existingPokemon = await Pokemon.findOne({ $or: [{ id }, { name }] });
    if (existingPokemon) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'POKEMON_EXISTS',
          message: 'Ya existe un Pokémon con este id o nombre'
        }
      });
    }

    const newPokemon = new Pokemon({
      id,
      name,
      type1,
      type2,
      imageUrl
    });

    await newPokemon.save();

    // Si se subió una imagen, renombrarla con el ID correcto del Pokémon
    if (req.file) {
      const oldPath = req.file.path;
      const newPath = path.join('public/images/pokemon', `${id}.png`);

      // Renombrar el archivo temporal al nombre correcto
      if (oldPath !== newPath) {
        try {
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
          }
        } catch (err) {
          console.error('Error renombrando archivo:', err);
        }
      }
    }

    res.status(201).json({
      success: true,
      data: newPokemon,
      message: 'Pokémon creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_POKEMON_ERROR',
        message: error.message
      }
    });
  }
};

// Actualizar Pokémon (admin)
exports.updatePokemon = async (req, res) => {
  try {
    const { id: paramId } = req.params;
    const { id, name, type1, type2, imageUrl } = req.body;
    const errors = [];

    // Validar id
    if (!id) {
      errors.push('El ID del Pokémon es requerido');
    } else if (typeof id !== 'number' && isNaN(id)) {
      errors.push('El ID debe ser un número');
    }

    // Validar nombre
    if (!name) {
      errors.push('El nombre es requerido');
    } else if (name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar type1
    if (!type1) {
      errors.push('El tipo 1 es requerido');
    }

    // Retornar errores si existen
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          details: errors
        }
      });
    }

    // Verificar si el Pokémon existe
    let pokemon = null;
    const numericParamId = Number(paramId);
    if (!Number.isNaN(numericParamId)) {
      pokemon = await Pokemon.findOne({ id: numericParamId });
    } else {
      pokemon = await Pokemon.findById(paramId).catch(() => null);
    }

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POKEMON_NOT_FOUND',
          message: 'Pokémon no encontrado'
        }
      });
    }

    // Verificar duplicados con otros Pokémon
    const duplicate = await Pokemon.findOne({
      $and: [
        { $or: [{ id }, { name }] },
        { _id: { $ne: pokemon._id } }
      ]
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'POKEMON_EXISTS',
          message: 'Ya existe otro Pokémon con este id o nombre'
        }
      });
    }

    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      pokemon._id,
      {
        id,
        name,
        type1,
        type2,
        imageUrl
      },
      { new: true, runValidators: true }
    );

    // Si se subió una nueva imagen, renombrarla con el ID correcto del Pokémon
    if (req.file) {
      const oldPath = req.file.path;
      const newPath = path.join('public/images/pokemon', `${id}.png`);

      // Renombrar el archivo temporal al nombre correcto
      if (oldPath !== newPath) {
        try {
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
          }
        } catch (err) {
          console.error('Error renombrando archivo:', err);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: updatedPokemon,
      message: 'Pokémon actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_POKEMON_ERROR',
        message: error.message
      }
    });
  }
};

// Eliminar Pokémon (admin)
exports.deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;

    let pokemon = null;
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      pokemon = await Pokemon.findOneAndDelete({ id: numericId });
    } else {
      pokemon = await Pokemon.findByIdAndDelete(id).catch(() => null);
    }

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POKEMON_NOT_FOUND',
          message: 'Pokémon no encontrado'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: pokemon,
      message: 'Pokémon eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_POKEMON_ERROR',
        message: error.message
      }
    });
  }
};


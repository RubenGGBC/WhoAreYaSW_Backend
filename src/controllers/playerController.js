const Player = require('../models/Player');
const Team = require('../models/Team');
const League = require('../models/League');

// Obtiene lista paginada de todos los jugadores
exports.getPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const players = await Player.find()
            .skip(skip)
            .limit(limit)
            .sort({ id: 1 });

        const total = await Player.countDocuments();
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: players,
            pagination: {
                page,
                limit,
                total,
                pages
            },
            message: 'Jugadores obtenidos exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PLAYERS_ERROR',
                message: error.message
            }
        });
    }
};

// Obtiene un jugador específico por ID
exports.getPlayersById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PLAYER_NOT_FOUND',
                    message: 'Jugador no encontrado'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: player,
            message: 'Jugador obtenido correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_PLAYER_ERROR',
                message: error.message
            }
        });
    }
};

// Crea un nuevo jugador, requiere rol admin
exports.createPlayer = async (req, res) => {
    try {
        const { id, name, birthDate, nationality, teamId, leagueId, position, number, imageUrl } = req.body;
        const errors = [];

        // Validar id
        if (!id) {
            errors.push('El ID del jugador es requerido');
        } else if (typeof id !== 'number' && isNaN(id)) {
            errors.push('El ID debe ser un número');
        }

        // Validar nombre
        if (!name) {
            errors.push('El nombre es requerido');
        } else if (name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        // Validar posición
        if (!position) {
            errors.push('La posición es requerida');
        } else if (!['DF', 'MF', 'FW', 'GK'].includes(position)) {
            errors.push('Posición inválida. Debe ser DF, MF, FW o GK');
        }

        // Validar número (opcional)
        if (number && isNaN(number)) {
            errors.push('El número debe ser numérico');
        }

        // Validar birthDate (opcional)
        if (birthDate && isNaN(Date.parse(birthDate))) {
            errors.push('Formato de fecha inválido');
        }

        // Validar teamId (opcional)
        if (teamId && isNaN(teamId)) {
            errors.push('El ID del equipo debe ser un número');
        }

        // Validar leagueId (opcional)
        if (leagueId && isNaN(leagueId)) {
            errors.push('El ID de la liga debe ser un número');
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

        // Verificar si el jugador ya existe
        const existingPlayer = await Player.findOne({ id });
        if (existingPlayer) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'PLAYER_EXISTS',
                    message: 'Ya existe un jugador con este ID'
                }
            });
        }

        const newPlayer = new Player({
            id,
            name,
            birthDate,
            nationality,
            teamId,
            leagueId,
            position,
            number,
            imageUrl
        });

        await newPlayer.save();

        res.status(201).json({
            success: true,
            data: newPlayer,
            message: 'Jugador creado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_PLAYER_ERROR',
                message: error.message
            }
        });
    }
};

// Actualiza un jugador existente, requiere rol admin
exports.updatePlayer = async (req, res) => {
    try {
        const { id, name, birthDate, nationality, teamId, leagueId, position, number, imageUrl } = req.body;
        const errors = [];

        // Validar id
        if (!id) {
            errors.push('El ID del jugador es requerido');
        } else if (typeof id !== 'number' && isNaN(id)) {
            errors.push('El ID debe ser un número');
        }

        // Validar nombre
        if (!name) {
            errors.push('El nombre es requerido');
        } else if (name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        // Validar posición
        if (!position) {
            errors.push('La posición es requerida');
        } else if (!['DF', 'MF', 'FW', 'GK'].includes(position)) {
            errors.push('Posición inválida. Debe ser DF, MF, FW o GK');
        }

        // Validar número (opcional)
        if (number && isNaN(number)) {
            errors.push('El número debe ser numérico');
        }

        // Validar birthDate (opcional)
        if (birthDate && isNaN(Date.parse(birthDate))) {
            errors.push('Formato de fecha inválido');
        }

        // Validar teamId (opcional)
        if (teamId && isNaN(teamId)) {
            errors.push('El ID del equipo debe ser un número');
        }

        // Validar leagueId (opcional)
        if (leagueId && isNaN(leagueId)) {
            errors.push('El ID de la liga debe ser un número');
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

        // Verificar si el jugador existe
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PLAYER_NOT_FOUND',
                    message: 'Jugador no encontrado'
                }
            });
        }

        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id,
            {
                id,
                name,
                birthDate,
                nationality,
                teamId,
                leagueId,
                position,
                number,
                imageUrl
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedPlayer,
            message: 'Jugador actualizado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_PLAYER_ERROR',
                message: error.message
            }
        });
    }
};

// Elimina un jugador, requiere rol admin
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PLAYER_NOT_FOUND',
                    message: 'Jugador no encontrado'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: player,
            message: 'Jugador eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'DELETE_PLAYER_ERROR',
                message: error.message
            }
        });
    }
};

// Obtiene lista de todos los equipos
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find().sort({ id: 1 });

        res.status(200).json({
            success: true,
            data: teams,
            message: 'Equipos obtenidos exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_TEAMS_ERROR',
                message: error.message
            }
        });
    }
};

// Obtiene lista de todas las ligas
exports.getLeagues = async (req, res) => {
    try {
        const leagues = await League.find().sort({ id: 1 });

        res.status(200).json({
            success: true,
            data: leagues,
            message: 'Ligas obtenidas exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_LEAGUES_ERROR',
                message: error.message
            }
        });
    }
};

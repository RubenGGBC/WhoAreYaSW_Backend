const Player = require('../models/Player');
const Team = require('../models/Team');
const League = require('../models/League');
const fs = require('fs');
const path = require('path');

// Obtiene lista paginada de todos los jugadores
exports.getPlayers = async (req, res) => {
    try {
        const pageRaw = parseInt(req.query.page);
        const limitRaw = parseInt(req.query.limit);
        const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
        const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 10;
        const skip = (page - 1) * limit;

        // Sistema de filtros (con ayuda de Copilot):
        const filter = {};

        // Búsqueda por nombre
        if (req.query.search) {
            const q = String(req.query.search).trim();
            if (q) {
                filter.name = { $regex: q, $options: 'i' };
            }
        }

        // Filtro por liga
        const leagueParam = req.query.league ?? req.query.leagueId;
        if (leagueParam !== undefined && leagueParam !== null && String(leagueParam).trim() !== '') {
            const leagueId = Number(leagueParam);
            if (!Number.isNaN(leagueId)) {
                filter.leagueId = leagueId;
            }
        }

        // Filtro por equipo
        const teamParam = req.query.team ?? req.query.teamId;
        if (teamParam !== undefined && teamParam !== null && String(teamParam).trim() !== '') {
            const teamId = Number(teamParam);
            if (!Number.isNaN(teamId)) {
                filter.teamId = teamId;
            }
        }

        // Filtro por nacionalidad
        if (req.query.nationality) {
            const nat = String(req.query.nationality).trim();
            if (nat) {
                filter.nationality = { $regex: `^${escapeRegex(nat)}$`, $options: 'i' };
            }
        }

        const players = await Player.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ id: 1 });

        const total = await Player.countDocuments(filter);
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

//Para el sistema de filtros, escapar caracteres especiales en regex (con ayuda de Copilot)
function escapeRegex(input) {
    return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

        // Si se subió una imagen, renombrarla con el ID correcto del jugador
        if (req.file) {
            const oldPath = req.file.path;
            const newPath = path.join('public/images/players', `${id}.png`);

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

        // Si se subió una nueva imagen, renombrarla con el ID correcto del jugador
        if (req.file) {
            const oldPath = req.file.path;
            const newPath = path.join('public/images/players', `${id}.png`);

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

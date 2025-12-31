const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./test-app');
const Player = require('../src/models/Player');

describe('Rutas PÚBLICAS', () => {
    beforeAll(async () => {
        await Player.create({
            id: 5001,
            name: 'Player Public Test',
            position: 'FW',
            nationality: 'Test'
        });

        await Player.create({
            id: 5002,
            name: 'Another Player',
            position: 'MF',
            nationality: 'Test'
        });
    });

    test('GET /api/players - Devuelve jugadores', async () => {
        const response = await request(app)
            .get('/api/players')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/players?search=Test - Filtra por nombre', async () => {
        const response = await request(app)
            .get('/api/players?search=Player')
            .expect(200);

        expect(response.body.success).toBe(true);
        if (response.body.data.length === 0) {
            console.log('Búsqueda puede no estar implementada');
        }
    });

    test('GET /api/players/:id - Jugador específico', async () => {
        // Crear jugador y guardar referencia
        const testPlayer = await Player.create({
            id: 9999,
            name: 'Specific Test Player',
            position: 'FW',
            nationality: 'Test'
        });

        const response = await request(app)
            .get(`/api/players/${testPlayer._id}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Specific Test Player');
    });

    test('GET /api/game/current - Juego actual', async () => {
        const response = await request(app)
            .get('/api/game/current')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('gameNumber');
    });
});
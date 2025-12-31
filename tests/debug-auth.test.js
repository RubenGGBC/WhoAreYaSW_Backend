const request = require('supertest');
const app = require('./test-app');


describe('Debug Auth Routes', () => {
    test('Verificar rutas disponibles', async () => {
        const routes = [
            '/auth/register',
            '/auth/login',
            '/auth/logout',
            '/auth/me',
            '/api/players',
            '/api/game/current'
        ];


        for (const route of routes) {
            const response = await request(app).get(route).catch(() => ({ status: 'ERROR' }));
            console.log(`${route}: ${response.status || 'ERROR'}`);
        }


        expect(true).toBe(true); // Solo para ver qué rutas existen
    });


    test('POST /auth/register - Ver qué pasa realmente', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                name: 'Debug',
                lastName: 'Test',
                email: 'debug@test.com',
                password: 'password123',
                confirmPassword: 'password123'
            });


        console.log('Status:', response.status);
        console.log('Body:', response.body);


        // No fallar, solo mostrar info
        expect(response.status).not.toBe(500); // Solo verifica que no es error interno
    });
});


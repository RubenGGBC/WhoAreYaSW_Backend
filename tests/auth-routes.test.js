const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./test-app');
const User = require('../src/models/User');

describe('Rutas de Auth ', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('POST /register - Registro exitoso', async () => {
        const userData = {
            name: 'Test',
            lastName: 'User',
            email: 'register@test.com',
            password: 'password123',
            confirmPassword: 'password123'
        };

        const response = await request(app)
            .post('/register')
            .send(userData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.user.email).toBe('register@test.com');
    });

    test('POST /register - Debe fallar si email existe', async () => {
        // Crear usuario primero
        await User.create({
            name: 'Existente',
            lastName: 'User',
            email: 'existente@test.com',
            password: 'password123',
            role: 'user'
        });

        const response = await request(app)
            .post('/register')
            .send({
                name: 'Otro',
                lastName: 'User',
                email: 'existente@test.com', // Mismo email
                password: 'password123',
                confirmPassword: 'password123'
            })
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });

    test('POST /register - Debe fallar si contraseñas no coinciden', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Test',
                lastName: 'User',
                email: 'mismatch@test.com',
                password: 'password123',
                confirmPassword: 'different' // No coincide
            })
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(['PASSWORD_MISMATCH', 'VALIDATION_ERROR']).toContain(response.body.error.code);
    });

    test('POST /login - Login exitoso', async () => {
        const user = new User({
            name: 'Login',
            lastName: 'Test',
            email: 'login@test.com',
            password: 'password123', // Se hasheará automáticamente
            role: 'user'
        });
        await user.save();

        const response = await request(app)
            .post('/login')
            .send({
                email: 'login@test.com',
                password: 'password123'
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.user.email).toBe('login@test.com');
    });

    test('POST /login - Debe fallar con credenciales incorrectas', async () => {
        const user = new User({
            name: 'Login',
            lastName: 'Test',
            email: 'login2@test.com',
            password: 'password123',
            role: 'user'
        });
        await user.save();

        const response = await request(app)
            .post('/login')
            .send({
                email: 'login2@test.com',
                password: 'wrongpassword'
            })
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
});
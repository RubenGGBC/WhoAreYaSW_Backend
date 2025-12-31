const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Modelo User', () => {
    test('Crear usuario válido', async () => {
        const userData = {
            name: 'Test',
            lastName: 'Usuario',
            email: 'test@ejemplo.com',
            password: 'password123',
            role: 'user'
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe('test@ejemplo.com');
        expect(savedUser.password).not.toBe('password123');
    });

    test('Buscar usuario por email', async () => {
        await User.create({
            name: 'Buscar',
            lastName: 'Test',
            email: 'buscar@test.com',
            password: 'password123',
            role: 'user'
        });

        const foundUser = await User.findOne({ email: 'buscar@test.com' });
        expect(foundUser).toBeDefined();
        expect(foundUser.name).toBe('Buscar');
    });

    test('Email duplicado debe fallar', async () => {
        await User.create({
            name: 'Usuario1',
            lastName: 'Test',
            email: 'duplicado@test.com',
            password: 'password123',
            role: 'user'
        });

        const user2 = new User({
            name: 'Usuario2',
            lastName: 'Test',
            email: 'duplicado@test.com',
            password: 'password456',
            role: 'user'
        });

        let error;
        try {
            await user2.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(11000);
    });

    test('Contraseña corta debe fallar', async () => {
        const user = new User({
            name: 'Test',
            lastName: 'ShortPass',
            email: 'short@test.com',
            password: '123',
            role: 'user'
        });

        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.password).toBeDefined();
    });
});
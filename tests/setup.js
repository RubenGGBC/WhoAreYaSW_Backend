const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    // Configurar variables para tests
    process.env.GOOGLE_CLIENT_ID = 'test';
    process.env.GOOGLE_CLIENT_SECRET = 'test';
    process.env.GOOGLE_CALLBACK_URL = 'http://test.com';
    process.env.GITHUB_CLIENT_ID = 'test';
    process.env.GITHUB_CLIENT_SECRET = 'test';
    process.env.GITHUB_CALLBACK_URL = 'http://test.com';

    // Iniciar MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conectar Mongoose
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    // Limpiar datos después de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        try {
            await collections[key].deleteMany();
        } catch (error) {
            // Ignorar errores
        }
    }
});

afterAll(async () => {
    // Limpiar
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
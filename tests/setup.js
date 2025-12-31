const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Antes de todos los tests
beforeAll(async () => {
    // Iniciar MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conectar mongoose a la BD en memoria
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB en memoria iniciada para tests');
});

// Después de cada test
afterEach(async () => {
    // Limpiar todas las colecciones
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

// Después de todos los tests
afterAll(async () => {
    // Desconectar y parar MongoDB en memoria
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('✅ MongoDB en memoria detenida');
});
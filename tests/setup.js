const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    process.env.GOOGLE_CLIENT_ID = 'test';
    process.env.GOOGLE_CLIENT_SECRET = 'test';
    process.env.GOOGLE_CALLBACK_URL = 'http://test.com';
    process.env.GITHUB_CLIENT_ID = 'test';
    process.env.GITHUB_CLIENT_SECRET = 'test';
    process.env.GITHUB_CALLBACK_URL = 'http://test.com';

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        try {
            await collections[key].deleteMany();
        } catch (error) {
        }
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
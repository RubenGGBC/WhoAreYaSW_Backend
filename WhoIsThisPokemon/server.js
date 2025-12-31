require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/db/connection');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor Pokemon corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error iniciando servidor:', error.message);
        process.exit(1);
    }
}

startServer();

// tests/find-auth-routes.test.js
const request = require('supertest');
const app = require('./test-app');


describe('Encontrar rutas de Auth correctas', () => {
    const testCases = [
        // Posibles rutas de REGISTER
        { method: 'POST', path: '/auth/register' },
        { method: 'POST', path: '/register' },
        { method: 'POST', path: '/api/auth/register' },
        { method: 'POST', path: '/api/register' },


        // Posibles rutas de LOGIN
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/login' },
        { method: 'POST', path: '/api/auth/login' },
        { method: 'POST', path: '/api/login' },
    ];


    test('Probar todas las combinaciones posibles', async () => {
        const results = [];


        for (const testCase of testCases) {
            const response = await request(app)
                [testCase.method.toLowerCase()](testCase.path)
                .send({
                    email: 'test@test.com',
                    password: 'test123'
                })
                .catch(err => ({
                    status: err.status || 'ERROR',
                    body: { message: err.message }
                }));


            results.push({
                route: `${testCase.method} ${testCase.path}`,
                status: response.status,
                body: response.body
            });
        }


        // Mostrar resultados
        console.log('\n📋 RESULTADOS DE RUTAS:');
        results.forEach(result => {
            console.log(`${result.route}: ${result.status} - ${JSON.stringify(result.body).substring(0, 100)}...`);
        });


        // Encontrar rutas que no sean 404
        const validRoutes = results.filter(r => r.status !== 404);
        console.log('\n✅ RUTAS VÁLIDAS ENCONTRADAS:');
        validRoutes.forEach(r => console.log(`  ${r.route}`));


        expect(validRoutes.length).toBeGreaterThan(0);
    });
});

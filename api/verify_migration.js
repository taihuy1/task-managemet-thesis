/**
 * Quick verification: start server, test login, then exit
 */
const http = require('http');

function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost', port: 3001, path, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        }, (res) => {
            let result = '';
            res.on('data', c => result += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(result) }); }
                catch { resolve({ status: res.statusCode, body: result }); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function get(path, token) {
    return new Promise((resolve, reject) => {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const req = http.request({ hostname: 'localhost', port: 3001, path, method: 'GET', headers }, (res) => {
            let result = '';
            res.on('data', c => result += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(result) }); }
                catch { resolve({ status: res.statusCode, body: result }); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function verify() {
    console.log('=== POST-MIGRATION VERIFICATION ===\n');

    // 1. Health check
    console.log('1. Health check...');
    const health = await get('/health');
    console.log(`   Status: ${health.status} | DB: ${health.body.database}\n`);

    // 2. Login with seeded author (password "123" is only 3 chars, validator requires min 6)
    console.log('2. Login with short password (expect 422)...');
    const shortPwd = await post('/auth/login', { email: 'prof.vondrak@university.edu', password: '123' });
    console.log(`   Status: ${shortPwd.status} | Message: ${shortPwd.body.message}`);
    if (shortPwd.body.errors) console.log(`   Errors: ${JSON.stringify(shortPwd.body.errors)}\n`);

    // 3. Register a test user with valid password
    console.log('3. Register new user...');
    const reg = await post('/auth/register', { email: 'test@test.com', password: 'test123456', name: 'Test User', role: 'SOLVER' });
    console.log(`   Status: ${reg.status} | Message: ${reg.body.message}`);
    if (reg.body.data) console.log(`   User: ${reg.body.data.name} (${reg.body.data.role})\n`);

    // 4. Login with new user
    console.log('4. Login with new user...');
    const login = await post('/auth/login', { email: 'test@test.com', password: 'test123456' });
    console.log(`   Status: ${login.status} | Message: ${login.body.message}`);
    if (login.body.data) {
        console.log(`   User: ${login.body.data.user.name} (${login.body.data.user.role})`);
        console.log(`   Token: ${login.body.data.accessToken.substring(0, 30)}...\n`);

        // 5. Access protected endpoint
        console.log('5. Get users (authenticated)...');
        const users = await get('/users', login.body.data.accessToken);
        console.log(`   Status: ${users.status}`);
        if (users.body.data) console.log(`   Found ${users.body.data.length} users\n`);
    }

    console.log('=== VERIFICATION COMPLETE ===');
}

verify().catch(e => console.error('Failed:', e.message));

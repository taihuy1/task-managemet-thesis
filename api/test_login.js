const http = require('http');

const tests = [
    { name: 'Author Login', email: 'prof.vondrak@university.edu', password: 'seed1223' },
    { name: 'Solver Login', email: 'tai.huy@student.edu', password: 'seed1223' },
];

async function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost', port: 3001, path, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        }, (res) => {
            let result = '';
            res.on('data', c => result += c);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(result) }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function run() {
    for (const t of tests) {
        console.log(`\n--- ${t.name} ---`);
        const r = await post('/auth/login', { email: t.email, password: t.password });
        console.log(`Status: ${r.status}`);
        console.log(`Message: ${r.body.message}`);
        if (r.body.data) {
            console.log(`User: ${r.body.data.user.name} (${r.body.data.user.role})`);
            console.log(`Token: ${r.body.data.accessToken.substring(0, 40)}...`);
        }
        if (r.body.errors) console.log(`Errors: ${JSON.stringify(r.body.errors)}`);
    }
}

run().catch(e => console.error('Failed:', e.message));

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_PATH = path.join(__dirname, '..', 'backend', 'server.js');

let failures = 0;

function logPass(message) {
    console.log(`PASS: ${message}`);
}

function logFail(message, error) {
    failures += 1;
    console.error(`FAIL: ${message}`);
    if (error) console.error(`  ${error.message || error}`);
}

async function waitForServer(timeoutMs = 10000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        try {
            await axios.get(`${BASE_URL}/api/crowd-data`, { timeout: 1500 });
            return;
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    throw new Error(`Server did not become ready within ${timeoutMs}ms`);
}

async function run() {
    const server = spawn(process.execPath, [SERVER_PATH], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: { ...process.env, PORT: String(PORT) }
    });

    try {
        await waitForServer();
        logPass('Server is running');

        const crowdResponse = await axios.get(`${BASE_URL}/api/crowd-data`, { timeout: 2000 });
        if (crowdResponse.status === 200 && crowdResponse.data?.zones?.gates) {
            logPass('/api/crowd-data returns telemetry payload');
        } else {
            logFail('/api/crowd-data returns telemetry payload', new Error('Unexpected telemetry response'));
        }

        const routeResponse = await axios.get(`${BASE_URL}/api/route`, {
            params: { start: 'Gate 1', end: 'A' },
            timeout: 2000
        });
        if (routeResponse.status === 200 && Array.isArray(routeResponse.data?.path) && routeResponse.data.path.length > 0) {
            logPass('/api/route returns a valid route');
        } else {
            logFail('/api/route returns a valid route', new Error('Unexpected route response'));
        }

        try {
            await axios.get(`${BASE_URL}/api/route`, {
                params: { start: '', end: 'A' },
                timeout: 2000
            });
            logFail('/api/route rejects empty inputs', new Error('Expected 400 response'));
        } catch (error) {
            if (error.response?.status === 400) {
                logPass('/api/route rejects empty inputs');
            } else {
                logFail('/api/route rejects empty inputs', error);
            }
        }

        try {
            await axios.get(`${BASE_URL}/api/route`, {
                params: { start: 'Gate X', end: 'Z' },
                timeout: 2000
            });
            logFail('/api/route rejects invalid values', new Error('Expected 400 response'));
        } catch (error) {
            if (error.response?.status === 400) {
                logPass('/api/route rejects invalid values');
            } else {
                logFail('/api/route rejects invalid values', error);
            }
        }
    } catch (error) {
        logFail('Basic API smoke test setup', error);
    } finally {
        server.kill();
    }

    if (failures > 0) {
        console.error(`\nTest run completed with ${failures} failure(s).`);
        process.exitCode = 1;
    } else {
        console.log('\nAll basic API checks passed.');
    }
}

run();

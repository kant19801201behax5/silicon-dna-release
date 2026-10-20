// Launcher for the binary release: load .env if present, default to production, then start the server.
// server.js does not read .env itself, and outside NODE_ENV=production it tries to load the Vite dev
// server, which is not shipped with this release.
const fs = require('fs');
if (fs.existsSync('.env')) {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile('.env');
  } else {
    // Node < 20.12 has no process.loadEnvFile: minimal KEY=VALUE reader; real environment wins.
    for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
require('./server.js');

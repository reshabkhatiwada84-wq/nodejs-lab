
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const logsDir = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(logsDir, 'server.log');

fs.mkdirSync(logsDir, { recursive: true });

class Logger extends EventEmitter {}

const logger = new Logger();

logger.on('request', (method, url) => {
    const entry = `${new Date().toISOString()} ${method} ${url}\n`;

    console.log(entry.trim());

    fs.appendFile(LOG_FILE, entry, (error) => {
        if (error) {
            console.error('Failed to write request log:', error.message);
        }
    });
});

logger.on('error', (error) => {
    console.error('Logger error:', error.message);
});

module.exports = { logger, LOG_FILE };

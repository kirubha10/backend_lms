const pino = require("pino");
const fs = require("fs");

// Create a writable stream for the log file
const date = new Date().toTimeString().split(" ")[0].replaceAll(":","_");
const logFileStream = fs.createWriteStream(`logs/${date}.log`, { flags: "a" });

// Create a Pino logger with the file stream
const logger = pino({ level: "info" }, logFileStream);
module.exports = logger;
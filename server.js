require('dotenv').config();
const http = require('http');
const app = require('./app')

const PORT = process.env.LOCAL;
const server = http.createServer(app);
server.listen(PORT);
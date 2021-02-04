const express = require('express');
const path = require('path');

const Server = require('./classes/server');
const server = new Server();
const publicPath = path.resolve(__dirname, '../public');

server.app.use(express.static(publicPath));

server.start((err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ server.port }`);
});




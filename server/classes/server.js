require('../config/config');

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        module.exports.io = socketIO(this.server);
        require('../sockets/socket');
    }

    start(callback){
        this.server.listen(this.port, callback);
    }
}

module.exports = Server;

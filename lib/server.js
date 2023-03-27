/* eslint-disable no-unused-vars */
/*

Title: Server Library
Description: Server related files
Author Name: Siam Ahmed
Date: 25/03/2023

*/

// dependencies
const http = require('http');
const { handleReqRes } = require('../helper/handleReqRes');
const environments = require('../helper/environments');

// server object - module scaffold
const server = {};

// create a server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environments.port, () => {
        console.log(`Listening to port ${environments.port}`);
    });
};

// handle request response
server.handleReqRes = handleReqRes;

server.init = () => {
    server.createServer();
};

module.exports = server;

/* eslint-disable no-unused-vars */
/*

Title: Project initial file
Description: Initial file to start the node server and workers
Author Name: Siam Ahmed
Date: 19/03/2023

*/

// dependencies

const server = require('./lib/server');
const worker = require('./lib/worker');

// app object - module scaffold

const app = {};

app.init = () => {
    // start the server
    server.init();
    // start the worker
    worker.init();
};

app.init();

module.exports = app;

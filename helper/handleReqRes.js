/*

Title: Request-Response Handler
Description: Handle the request comes from users and show on console.
Author Name: Siam Ahmed
Date: 19/03/2023

*/

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilites');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // response handle
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const { path } = parsedUrl;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // eslint-disable-next-line prefer-destructuring
    trimmedPath = trimmedPath.split('?')[0];
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);
        chosenHandler(requestProperties, (_statusCode, _payload) => {
            const statusCode = typeof _statusCode === 'number' ? _statusCode : 500;
            const payload = typeof _payload === 'object' ? _payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;

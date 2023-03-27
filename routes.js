/*

Title: Routes
Description: Application Routes
Author Name: Siam Ahmed
Date: 19/03/2023

*/

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
    about: aboutHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;

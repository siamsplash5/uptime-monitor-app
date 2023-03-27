/*

Title: Not found Handler
Description: Handle not found handler.
Author Name: Siam Ahmed
Date: 20/03/2023

*/
// module scaffodling
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(404, {
        message: 'Page not found.',
    });
};

module.exports = handler;

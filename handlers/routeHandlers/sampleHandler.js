/*

Title: Sample Page Handler
Description: Handle the activity of sample page.
Author Name: Siam Ahmed
Date: 20/03/2023

*/
// module scaffodling
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(200, {
        message: 'This is sample page.',
    });
};

module.exports = handler;

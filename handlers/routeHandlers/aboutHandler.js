/*

Title: About Page Handler
Description: Handle the activity of about page.
Author Name: Siam Ahmed
Date: 20/03/2023

*/

// module scaffolding

const handler = {};

handler.aboutHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(200, {
        message: 'This is about page.',
    });
};

module.exports = handler;

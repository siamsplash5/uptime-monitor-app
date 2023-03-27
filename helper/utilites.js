/*

Title: Utilities
Description: Important utilities function
Author Name: Siam Ahmed
Date: 23/03/2023

*/

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output = {};
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

utilities.hash = (str) => {
    const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
    return hash;
};
utilities.createRandomString = (length) => {
    const strOfCharacters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i += 1) {
        randomString += strOfCharacters[Math.floor(Math.random() * 36)];
    }
    return randomString;
};

utilities.isValidName = (name) => typeof name === 'string' && name.trim().length > 0;
utilities.isValidPhone = (phone) => typeof phone === 'string' && phone.trim().length === 11;
utilities.isValidPassword = (pass) => typeof pass === 'string' && pass.trim().length > 0;
utilities.isValidProtocol = (protocol) => {
    const protocols = ['http', 'https'];
    return protocols.includes(protocol);
};
utilities.isValidUrl = (url) => typeof url === 'string' && url.length > 0;
utilities.isValidMethod = (method) => {
    const acceptedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    return acceptedMethods.includes(method);
};
utilities.isValidSuccessCode = (code) => typeof code === 'object' && code instanceof Array;
// eslint-disable-next-line prettier/prettier
utilities.isValidTimeOutSecond = (timeoutSec) => typeof timeoutSec === 'number' && timeoutSec <= 5 && timeoutSec % 1 === 0;

module.exports = utilities;

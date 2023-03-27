/*

Title: Request-Response Handler
Description: Handle the request comes from users and show on console.
Author Name: Siam Ahmed
Date: 21/03/2023

*/

// dependencies

const https = require('https');
const { isValidPhone } = require('./utilites');
const { twilio } = require('./environments');

// module scaffolding
const notifications = {};

// send sms to user using twilio api

notifications.sendTwilioSms = (phone, msg, callback) => {
    // eslint-disable-next-line prettier/prettier
    const userMsg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg : false;
    if (isValidPhone(phone) && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: phone,
            Body: userMsg,
        };
        // stringify the payload
        const stringifyPayload = JSON.stringify(payload);
        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successful if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned ${status}`);
            }
        });
        req.on('error', (e) => {
            callback(e);
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given parameters are missing or invalid');
    }
};

module.exports = notifications;

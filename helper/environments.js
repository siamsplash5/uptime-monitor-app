/* eslint-disable prettier/prettier */
/*

Title: Environments
Description: Handle all environment related things
Author Name: Siam Ahmed
Date: 21/03/2023

*/

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'lsslsfosgogu',
    maxChecks: 5,
    twilio: {
        fromPhone: '+14754729908',
        accountSid: 'ACd9cd86115b1113a57cb49ce07092fc61',
        authToken: '83a884e2f36e3bcd8fbdd658595d6107',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ssosfguglslmb',
    maxChecks: 5,
  twilio: {
        fromPhone: '+14754729908',
        accountSid: 'ACd9cd86115b1113a57cb49ce07092fc61',
        authToken: '83a884e2f36e3bcd8fbdd658595d6107',
    },
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport = environments[currentEnvironment];

module.exports = environmentToExport;

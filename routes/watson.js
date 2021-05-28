const express = require('express');
const  router = express.Router();
//const watsonController = require('../controller/watsonController');
const {IamAuthenticator} = require('ibm-watson/auth');
const AssistantV2 = require('ibm-watson/assistant/v2');
const HttpsProxyAgent = require('https-proxy-agent');

//const httpsAgent = new HttpsProxyAgent("http://localhost:3000");
const authenticator = new IamAuthenticator({
    apikey: process.env.ASSISTANT_APIKEY
});

const assistant = new AssistantV2({
    version: process.env.VERSION,
    authenticator,
    //serviceUrl: process.env.ASSISTANT_SERVICEURL,
    serviceUrl: "https://api.eu-gb.assistant.watson.cloud.ibm.com",
    disableSslVerification: true
});

//session creation
router.get('/sessions', async (req, res) => {
    try {
        const session = await assistant.createSession({
            assistantId: "6c439c4b-12ba-483f-9250-328de620975f"
        });
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

module.exports = router
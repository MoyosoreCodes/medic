const {IamAuthenticator} = require('ibm-watson/auth');
const AssistantV2 = require('ibm-watson/assistant/v2');

const assistant = new AssistantV2({
    version: process.env.VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_APIKEY
    }),
    //serviceUrl: process.env.ASSISTANT_SERVICEURL,
    serviceUrl: process.env.ASSISTANT_SERVICEURL,
    disableSslVerification: true
});

module.exports = {
    createSession: async () => {
        try {
            const session = await assistant.createSession({
                assistantId: process.env.ASSISTANT_ID
            });

            console.log(session);

            return {
                status: session.status,
                result: session.result
            }
        } catch (error) {
            console.log(error);
            return error
        }
    },

    sendMessage: async (message) => {
        try {
            
        } catch (error) {
            
        }
    }
}

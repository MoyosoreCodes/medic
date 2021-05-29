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

            return {
                status: session.status,
                result: session.result
            }
        } catch (error) {
            console.log(error);
            return error
        }
    },

    sendMessage: async (sessionId, msg) => {
        try {
            const payload = {
                assistantId: process.env.ASSISTANT_ID,
                sessionId,
                input: {
                    message_type: 'text',
                    text: msg
                }
            }
            
            const message = await assistant.message(payload);

            return {
                status: message.status,
                result: message.result
            }
        } catch (error) {
            console.log(error);
            return error
        }
    }
}

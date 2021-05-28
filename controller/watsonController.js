const {IamAuthenticator} = require('ibm-watson/auth');
const AssistantV2 = require('ibm-watson/assistant/v2');


const authenticator = new IamAuthenticator({
    apikey: 'YdnzDVJOa01daDhHHSe3ADH4HTTz3gkYuhsPW8ok5tAO'
});

const assistant = new AssistantV2({
    version: "2020-09-24",
    authenticator: authenticator,
    //serviceUrl: process.env.ASSISTANT_SERVICEURL,
    url: process.env.ASSISTANT_SERVICEURL,
    headers: {
        'X-Watson-Learning-Opt-Out': 'true'
    },
});

module.exports = {
    createSession: async () => {
        try {
            const session = await assistant.createSession({
                assistantId: `${process.env.ASSISTANT_ID}`
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

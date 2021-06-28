const {IamAuthenticator} = require('ibm-watson/auth');
const AssistantV2 = require('ibm-watson/assistant/v2');

const assistant = new AssistantV2({
    version: "2020-09-24",
    authenticator: new IamAuthenticator({
        apikey: "YdnzDVJOa01daDhHHSe3ADH4HTTz3gkYuhsPW8ok5tAO"
    }),
    //serviceUrl: process.env.ASSISTANT_SERVICEURL,
    serviceUrl: "https://api.eu-gb.assistant.watson.cloud.ibm.com",
    disableSslVerification: true
});

module.exports = {
    assistant,
    createSession: async () => {
        try {
            const session = await assistant.createSession({
                assistantId: "6c439c4b-12ba-483f-9250-328de620975f"
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
    }, 

    updateMessage: (input, response) => {
        try {
            var responseText = null;
            if (!response.output) {
                response.output = {};
            } else {
                return response;
            }
            if(response.intents && response.intents[0]) {
                var intent = respones.intents[0];
                if (intent.confidence >= 0.75) {
                responseText = 'I understood your intent was ' + intent.intent;
                } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent;
                } else {
                responseText = 'I did not understand your intent';
                }
                response.output.text = responseText;
                return response
            }
            /*
            if (response.intents && response.intents[0]) {
                var intent = response.intents[0];
                // Depending on the confidence of the response the app can return different messages.
                // The confidence will vary depending on how well the system is trained. The service will always try to assign
                // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
                // user's intent . In these cases it is usually best to return a disambiguation message
                // ('I did not understand your intent, please rephrase your question', etc..)
                if (intent.confidence >= 0.75) {
                  responseText = 'I understood your intent was ' + intent.intent;
                } else if (intent.confidence >= 0.5) {
                  responseText = 'I think your intent was ' + intent.intent;
                } else {
                  responseText = 'I did not understand your intent';
                }
              }
              response.output.text = responseText;
              return response;
            }*/
        } catch (error) {
            
        }
    }
}

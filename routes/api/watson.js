const express = require('express');
const  router = express.Router();
const watsonController = require('../../controller/watsonController');
const {assistant } = require('../../controller/watsonController');
let session_id = null;

//session creation
router.get('/sessions', async (req, res) => {
    try {
        const session = await watsonController.createSession();
        return res.json(session);
    } catch (error) {
        //console.log(error);
        return res.json(error)
    }
})

//send message route
router.post('/message', async (req ,res) => {
    
    try {
        const reused = session_id != null
        console.log('before: ', session_id);
        if(session_id == undefined || session_id == null){
            const session = await watsonController.createSession();
            session_id = session.result.session_id;
            req.headers.session_id = session_id;
            console.log('now: ',session_id);
            //return res.json({id: session.result.session_id, reused})
        }

        const message = await watsonController.sendMessage(session_id, req.body.input)
        //console.log(message.result.output);
        var intents = message.result.output.intents[0];
        //var entities = message.result.output.entities
        
            var actualIntent = intents.intent
            console.log('intent is: ', actualIntent);

            console.log('here');
            var entities = message.result.output.entities
            let appointmentDate, appointmentTime, complaints;
            entities.map((entity) => {
                if(entity.entity == 'sys-date') {appointmentDate = entity.value; console.log('date: ', appointmentDate); }
                if(entity.entity == 'sys-time') {appointmentTime = entity.value; console.log('time: ',appointmentTime); }
                //if(entity.entity == 'symptoms') {appointmentTime = entity.value; console.log(appointmentTime); }

            })
            
            //return res.json(message)
        return res.json({message, reused})
    } catch (error) {
        //console.log(error);
        return res.json(error)
    }
})

module.exports = router
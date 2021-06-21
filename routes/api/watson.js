const express = require('express');
const  router = express.Router();
const watsonController = require('../../controller/watsonController');

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
        const msg = req.body.input;
        const sessionId = req.headers.session_id;

        const message = await watsonController.sendMessage(sessionId, msg);

        return res.json(message)
    } catch (error) {
        //console.log(error);
        return res.json(error)
    }
})

module.exports = router
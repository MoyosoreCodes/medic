const express = require('express');
const  router = express.Router();
const watsonController = require('../controller/watsonController');

//session creation
router.get('/sessions', async (req, res) => {
    try {
        const session = await watsonController.createSession();
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

module.exports = router
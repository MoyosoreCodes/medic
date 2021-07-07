const express = require('express')
const router = express.Router()
const appointmentController = require('../../controller/appointmentController');
const userController = require('../../controller/userController');

//get appointment
router.get('/', async (req, res) => {
    const result = await appointmentController.view(req);
    //console.log(result.message);
    return res.status(result.status).json(result);
});

//create appointments
router.post('/', async (req, res) => {
    //console.log(req.body)
    const result = await appointmentController.create(req);
    console.log(result);
    return res.status(result.status).json(result)
});

//what happens when i want to create a follow_up appointment
//maybe create it with a 'follow_up' type

module.exports = router
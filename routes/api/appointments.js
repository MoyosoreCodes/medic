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
    return res.status(result.status).json(result)
});

router.get('/create', (req, res) => {
    res.render('appointments');
})

router.get('/status', (req, res) => {
    //create function to view appointment status in the controller
})

//what happens when i want to create a follow_up appointment
//maybe create it with a 'follow_up' type

module.exports = router
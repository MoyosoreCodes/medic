const express = require('express')
const router = express.Router()
const appointmentService = require('../services/appointmentService');
const appointmentController = require('../controller/appointmentController');

//get appointment
router.get('/', async (req, res) => {
    const result = await appointmentController.list(req);
    //console.log(result.message);
    return res.status(result.status).json(result);
});

//create appointments
router.post('/', async (req, res) => {
    const result = await appointmentController.create(req);
    //console.log(result.message);
    return res.status(result.status).json(result)
});

//what happens when i want to create a follow_up appointment
//maybe create it with a 'follow_up' type
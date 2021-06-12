const express = require('express')
const router = express.Router()
const appointmentService = require('../services/appointmentService');

//get appointment
router.get('/', (req, res) => {

});

//create appointments
router.post('/', (req, res) => {

});

//what happens when i want to create a follow_up appointment
//maybe create it with a 'follow_up' type
const express = require('express');
const  router = express.Router();
const appointmentController = require('../../controller/appointmentController');
const userController = require('../../controller/userController');

router.get('/create', (req, res) => {
    res.render('appointments');
})

router.get('/status', (req, res) => {
    //create function to view appointment status in the controller
})

//client creates appointment
router.post('/appointments/create', authUser, async (req, res) => {
    try {
        const _id =  data.session.passport.user;
        const user = await userDB.findOne({_id});
        console.log(`${user.first_name} is making appointments`);
        if(user.user_type.toUpperCase() == user_types.PATIENT){
            const result = await userController.createAppointment(req);
            if(result.status !== 200){
                return res.redirect('/dashboard/patient')
            }
            return res.redirect('/dashboard/patient')
        }
        return res.redirect('/landing')
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }
    }
});
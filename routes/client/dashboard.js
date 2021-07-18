const express = require('express')
const router = express.Router();
const userDB = require('../../database/userDB');
const { Appointment, appointment_status, appointment_types } = require('../../model/appointmentModel');
const userRecords = require('../../model/recordModel').Records;
const { user_types } = require('../../model/userModel');
const userController = require('../../controller/userController');

// *middleware*
const authUser = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }
    else {
        return res.status(401).redirect('/login')
    }
}

router.get('/', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.PATIENT){
            return res.redirect('/dashboard/patient')
        }
        return res.redirect('/dashboard/doctor')
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }
    }
})

// *get routes*
router.get('/patient', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.PATIENT){
            const records = await userRecords.findOne({patientId:user._id})
            console.log(records);
            const appointments = await Appointment.find({patient: _id}).populate('doctor', 'first_name last_name')
            const medications = records.medications
            return res.render('index', { user, records, appointments, medications })
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }
    }
});

router.get('/doctor', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            const patients = await userDB.User.find({user_type: user_types.PATIENT})
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name')
            const pendingAppointments = await Appointment.find({doctor: _id, status: appointment_status.PENDING})
            return res.render('dashboard', { user, patients, appointments, pendingAppointments})
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }        
    }
});

router.get('/patient-list', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name')
            const patients = await userDB.User.find({user_type: user_types.PATIENT})
            return res.render('patientsList', { user, patients, appointments})
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }       
    }
});

router.get('/records', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            // const patient = await userDB.User.findOne({cardNumber: req.params.id});
            // const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name')
            const records = await userRecords.find().populate('patientId', 'first_name last_name')
            return res.render('editRecord', { user, appointments, records})
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }       
    }
});

router.get('/record/:id', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            const patient = await userDB.User.findOne({_id: req.params.id});
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name')
            const records = await userRecords.findOne({patientId: req.params.id}).populate('patient', 'first_name last_name')
            return res.render('editRecord', { user, patient, records, appointments})
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }      
    }
});

router.get('/appointments', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            // const patient = await userDB.User.findOne({cardNumber: req.params.cardNumber});
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name cardNumber');
            return res.render('appointmentList', { user, appointments})
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }     
    }
});

router.get('/appointments/accept/:id', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            await Appointment.updateOne(
                {_id: req.params.id}, 
                {status: appointment_status.APPROVED}
            )
            // const patient = await userDB.User.findOne({cardNumber: req.params.cardNumber});
            // const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name cardNumber');
            return res.redirect('/dashboard/appointments')
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }        
    }
});

router.get('/appointments/decline/:id', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            await Appointment.updateOne(
                {_id: req.params.id}, 
                {status: appointment_status.CANCELLED}
            )
            // const patient = await userDB.User.findOne({cardNumber: req.params.cardNumber});
            // const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name cardNumber');
            return res.redirect('/dashboard/appointments')
        }
        return res.redirect('/landing');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }       
    }
});



// *post routes*

//client creates appointment
router.post('/appointments/create', authUser, async (req, res) => {
    try {
        const _id =  data.session.passport.user;
        const user = await userDB.findOne({_id});
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            const result = await userController.createAppointment(req);
            if(result.status !== 200){
                return res.redirect('/dashboard/patient', result.status)
            }
            return res.redirect('/dashboard/patient', result.status)
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

router.post('/profile/update', authUser, async (req, res) => {
    
})

router.post('/dashboard/record', authUser, async (req, res) => {
    try {
        const body = req.body
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id}); 
        
        if(user.user_type.toUpperCase() == user_types.DOCTOR) {
            
        }
        
    } catch (error) {
        
    }
})

module.exports = router 
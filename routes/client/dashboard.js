const express = require('express')
const router = express.Router();
const userDB = require('../../database/userDB');
const { Appointment, appointment_status, appointment_types } = require('../../model/appointmentModel');
const userRecords = require('../../model/recordModel').Records;
const {Medication} = require('../../model/recordModel')
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
            return res.redirect('/dashboard/patient');
        }
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            return res.redirect('/dashboard/doctor');
        }
        return res.redirect('/');
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
            //console.log(records);
            const medications = records.medications
            const appointments = await Appointment.find({patient: _id}).populate('doctor', 'first_name last_name')
            // const medications = await Medication.find({medications: records.medications})
            return res.render('patient', { user, records, appointments, medications })
        }
        return res.redirect('/');
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
        return res.redirect('/');
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
            return res.render('patientList', { user, patients, appointments})
        }
        return res.redirect('/');
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
        console.log('here');
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            //const patient = await userDB.User.find();
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name')
            const patients = await userDB.User.find({user_type: user_types.PATIENT})//.populate('records', 'allergies observations')
            console.log(patients);
            return res.render('record', { user,appointments, patients})
        }
        return res.redirect('/');
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
            console.log(patient);
            console.log(records);
            return res.render('editRecord', { user, patient, records, appointments})
        }
        return res.redirect('/');
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
        return res.redirect('/');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }     
    }
});
router.get('/profile', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.DOCTOR){
            // const patient = await userDB.User.findOne({cardNumber: req.params.cardNumber});
            const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name cardNumber');
            return res.render('profile', { user, appointments})
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }     
    }
})

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
        return res.redirect('/');
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
        return res.redirect('/');
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
router.post('/appointments/', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id});
        console.log(`${user.first_name} is making appointments`);
        if(user.user_type.toUpperCase() == user_types.PATIENT){
            const result = await userController.createAppointment(req);
            if(result.status !== 200){
                return res.redirect('/dashboard/patient')
            }
            return res.redirect('/dashboard/patient')
        }
        return res.redirect('/')
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

router.post('/record/:id', authUser, async (req, res) => {
    try {
        const body = req.body
        console.log(body);        
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id}); 
        console.log(`${user.first_name} is creating record`);
        if(user.user_type.toUpperCase() == user_types.DOCTOR) {
            await userController.createRecord(req.params.id, body);
            return res.redirect('/dashboard/records')
        }
        return res.redirect('/')
    } catch (error) {
        
    }
})

module.exports = router 
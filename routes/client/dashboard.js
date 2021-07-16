const express = require('express')
const router = express.Router();
const userDB = require('../../database/userDB');
const { Appointment } = require('../../model/appointmentModel');
const userRecords = require('../../model/recordModel').Records;
const { user_types } = require('../../model/userModel');
const userServices = require('../../services/userServices');

// *middleware*
const authUser = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }
    else {
        return res.status(401).redirect('/login')
    }
}

// *get routes*
router.get('/', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.PATIENT){
            const records = await userRecords.findOne({patientId:_id}).populate('appointments', 'appointment_type appointmentDate appointmentTime doctor status');
            const appointments = records.appointments
            const medications = records.medications
        
            return res.render('profile', { user, records, appointments, medications })
        }
        
    } catch (error) {
        
    }

});

// *post routes*

//client creates appointment
router.post('/appointments/create', authUser, async (req, res) => {
    try {
        const body = req.body
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id});
    
        if(user.user_type.toUpperCase() == user_types.PATIENT) {
            //then check for available doctors
            const doctorToAssign = await userServices.findAvailableDoctor();
            
            if(doctorToAssign.status == 404 || doctorToAssign.status == 500)
            {
                return {
                    status: doctorToAssign.status,
                    message: doctorToAssign.message,
                }   
            }
            const availableDoctor = {'doctor': doctorToAssign.data._id};
            Object.assign(body, availableDoctor);
            
            //if there is an available doctor 
            if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                //then create appointment for patient
                const patient = {'patient': user._id};
                Object.assign(body, patient);
    
                const newAppointment = await Appointment.create(body);
                if(!newAppointment) {
                    console.log('error is at making new appointment');
                    return {
                        status: 500,
                        message: 'There was an error while making your appointment',
                        data: null
                    }
                }
    
                await userRecords.updateOne(
                    {patientId: user._id},
                    {$push: {appointments: appointment._id} },
                    {upsert:true}
                )
                
                const foundRecord = await userRecords.findOne({patientId: user._id})
                if(!foundRecord) {
                    return {
                        status: 404,
                        message: 'Record not found',
                    }   
                }
    
                return res.redirect('/')
            }
        }
        
    } catch (error) {
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }
    }
});

router.post('/profile/update', authUser, async (req, res) => {
    
})

module.exports = router 
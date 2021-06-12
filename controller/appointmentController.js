const appointmentModel = require('../model/appointmentModel');
const userDB = require('../database/userDB').User;
const appointmentService = require('../services/appointmentService');

module.exports ={
    create: async (data) => {
        try {
            const body = data.body
            const email = data.user.email
            console.log('user email:', email);
            console.log('body:', body);
            //add this to route to check user id
            //passing req.user into the route then validating the user, don't think it's necessary it's just to be sure
            const patient = await userDB.findOne({email})
            if(!patient) {
                return {
                    status: 404,
                    message: 'User does not exist/Unauthorized',
                    data: null
                }
            }
            console.log(patient);
            body.patient = patient._id    
            const availableDoctor = await appointmentService.findAvailableDoctor()
            body.prefferred_personnel = availableDoctor.data

            //creating new appointment
            if(body.prefferred_personnel !== null && body.prefferred_personnel !== undefined){
                const newAppointments = await appointmentModel.create(body);
                if(!newAppointments) {
                    console.log('error is at making new appointment');
                    return {
                        status: 500,
                        message: 'Error making appointments',
                        data: error
                    }
                }
                return {
                    status: 200,
                    message: 'appointments created',
                    data: newAppointments
                }
            }
        } catch (error) {
            console.log('catch error');
            return {
                status: 500,
                message: 'Error making appointments',
                data: error
            }
        }   
    },
    
    list: async (query) => {
        //to be used by doctors and or receptionist
        try {
            const appointments = await appointmentModel.find(query)//.populate('patient')
            if(!appointments) {
                return {
                    status: 500,
                    message: 'Error making appointments',
                    data: null
                }
            }
 
            return {
                status: 200,
                message: 'appointments created',
                data: appointments
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error making appointments',
                data: error
            }
        }
        
    }
}
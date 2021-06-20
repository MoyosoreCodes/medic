const appointmentModel = require('../model/appointmentModel');
const appointmentService = require('../services/appointmentService');

module.exports ={
//who can create appointments?? 
//if it's  patients then the creation process should check for available doctors
    create: async (data) => {
        try {
            //initialize variables
            const body = data.body;
            const _id = data.user._id
            const user_type = data.user.user_type
            var availableDoctor

            //first check for user type
            if(user_type.toUpperCase() == 'PATIENT') {
                //then check for available doctors
                availableDoctor = await appointmentService.findAvailableDoctor()
                body.doctor = availableDoctor.data
                //if there is an available doctor 
                if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                    //then create appointment for patient
                    body.patient = _id;
                    const newAppointment = await appointmentModel.create(body);
                    if(!newAppointment) {
                        console.log('error is at making new appointment');
                        return {
                            status: 500,
                            message: 'Appointment creation failed',
                            data: null
                        }
                    }
                    return {
                        status: 200,
                        message: 'appointments created by' + user_type,
                        data: newAppointment
                    }
                }
            }
            //if not patient then either doctor is creating the appointment
            //so there is no need to check for available doctors
            else {
                //const _id = data.user._id
                //availableDoctor =  await userDB.findById({_id});
                body.doctor = _id
                if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                    //then create appointment for patient
                    const newAppointment = await appointmentModel.create(body);
                    if(!newAppointment) {
                        console.log('error is at making new appointment');
                        return {
                            status: 500,
                            message: 'Appointment creation failed',
                            data: null
                        }
                    }
                    return {
                        status: 200,
                        message: 'appointments created by'+ user_type,
                        data: newAppointment
                    }
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
}
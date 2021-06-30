const appointmentModel = require('../model/appointmentModel');
const { user_types } = require('../model/userModel');
const userDB = require('../database/userDB');
const appointmentService = require('../services/appointmentService');

module.exports ={
//who can create appointments?? 
//if it's  patients then the creation process should check for available doctors
    create: async (data) => {
        try {
            return {
                message: data.query
            }

            //initialize variables
            /*const body = data.body;
            var availableDoctor, patient

            const user = await userDB.findOne({cardNumber: body.cardNumber});
            if(!user) {
                return {
                    status: 404,
                    message: 'User Data not Found, Create an account to Fix this issue',
                    data: null
                }
            }
            if(user.user_type.toUpperCase() == user_types.PATIENT) {
                //then check for available doctors
                const doctorToAssign = await appointmentService.findAvailableDoctor();
                availableDoctor = {'doctor': doctorToAssign.data};
                Object.assign(body, availableDoctor);
                //body.doctor = availableDoctor.data
                //if there is an available doctor 
                if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                    //then create appointment for patient
                    patient = {'patient': user._id};
                    Object.assign(body, patient);
                    //body.patient = user._id;
                    const newAppointment = await appointmentModel.create(body);
                    if(!newAppointment) {
                        console.log('error is at making new appointment');
                        return {
                            status: 500,
                            message: 'There was an error while making your appointment, please proceed to fill out the form',
                            data: null
                        }
                    }
                    return {
                        status: 200,
                        message: 'appointments created by' + user.user_type,
                        data: newAppointment
                    }
                }
            }*
            //if not patient then either doctor is creating the appointment
            //so there is no need to check for available doctors
            /*else {
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
            }*/
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
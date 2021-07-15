const {Appointment, appointment_types, appointment_status} = require('../model/appointmentModel');
const { user_types } = require('../model/userModel');
const {User} = require('../database/userDB');
const recordModel = require('../model/recordModel').Records;
const userServices = require('../services/userServices');

module.exports ={
//who can create appointments?? 
//if it's  patients then the creation process should check for available doctors
    create: async (data) => {
        try {

            //initialize variables
            const body = data.body;
            console.log(body)
            var availableDoctor, patient

            const foundUser = await userServices.getPatientByCardNumber(body.cardNumber);
            if (foundUser.status !== 200)
            {
                return {
                    status: foundUser.status,
                    message: foundUser.message,
                }   
            }
            const user = foundUser.data;

            
            if(user.user_type.toUpperCase() == user_types.PATIENT) {
                //then check for available doctors
                const doctorToAssign = await userServices.findAvailableDoctor();
                //console.log(doctorToAssign.data);
                if(doctorToAssign.status !== 200)
                {
                    return {
                        status: doctorToAssign.status,
                        message: doctorToAssign.message,
                    }   
                }
                availableDoctor = {'doctor': doctorToAssign.data._id};
                Object.assign(body, availableDoctor);
                //body.doctor = availableDoctor.data
                //if there is an available doctor 
                
                if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                    //then create appointment for patient
                    patient = {'patient': user._id};
                    Object.assign(body, patient);
                    //body.patient = user._id;
                    console.log(body)
                    const newAppointment = await Appointment.create(body);
                    if(!newAppointment) {
                        console.log('error is at making new appointment');
                        return {
                            status: 500,
                            message: 'There was an error while making your appointment, please proceed to fill out the form',
                            data: null
                        }
                    }
                    const newRecord = await recordModel.updateOne(
                        {patientId: user._id},
                        {"$push": {"appointments": newAppointment._id} },
                        {upsert:true}
                    )

                    const foundRecord = await recordModel.findById({_id: newRecord._id})
                    if(!foundRecord) {
                        return {
                            status: 404,
                            message: 'Record not found',
                        }   
                    }

                    return {
                        status: 200,
                        message: `Appointments created successfully with Dr. ${doctorToAssign.data.first_name}`,
                        data: foundRecord
                    }
                }
            }
        } catch (error) {
            console.log('catch error');
            return {
                status: 500,
                message: "We're currently experienceing issues from our server. Cannot make appointment for you at this time ",
                data: error
            }
        }   
    },

    view: async (data) => {
        try{
            const body = data.body;
            const foundUser = await userServices.getPatientByCardNumber(body.cardNumber);
            const user = foundUser.data
            let query

            if(body.appointmentDate) {
                query = {
                    "patient": user._id, 
                    "status": `${appointment_status.PENDING}`,
                    appointmentDate
                }
            }else {
                query = {
                    "patient": user._id, 
                    "status": `${appointment_status.PENDING}`
                }
            }

            
            const userAppointments =  await Appointment.find(query);
            const appointmentCount = userAppointments.count();
            
            console.log(userAppointments);
            
            //if no appointments
            if(!userAppointments || userAppointments == []) {
                return {
                    status: 404,
                    message: `You have no pending appointment`,
                    data: null
                }
            }
            //if user has only one appointment
            if(appointmentCount == 1) {
                const _id = userAppointments[0].doctor;
                const date = userAppointments[0].appointmentDate
                const doctor = User.findById({_id});

                return {
                    status: 200,
                    message: `You have an appointment(s) with Dr ${doctor.first_name} on ${date}`,
                    url:'https://ehrsys-api.herokuapp.com/dashboard/appointments',
                    data: null
                }
            }

            return {
                status: 200,
                message: `You have ${appointmentCount} pending appointment(s)`,
                url:'https://ehrsys-api.herokuapp.com/dashboard/appointments',
                data: null
            }
        }catch (err) {
            console.log('catch error');
            return {
                status: 500,
                message: "Sorry I'm having technical difficulties retrieving your appointments",
                data: error
            }
        }
    },

    
}
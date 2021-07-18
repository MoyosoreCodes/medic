const userDB = require('../database/userDB').User;
const recordModel = require('../model/recordModel').Records;
const userServices = require('../services/userServices')
const {Appointment, appointment_status, appointment_types} = require('../model/appointmentModel')
const {user_types} = require('../model/userModel')

module.exports = {
    // create user appointment
    createAppointment: async (data) => {
        try {
            const body = data.body
            const _id =  data.session.passport.user;
            const user = await userDB.findOne({_id});
        
            if(user.user_type.toUpperCase() == user_types.PATIENT) {
                //then check for available doctors
                const doctorToAssign = await userServices.findAvailableDoctor();
                
                if(doctorToAssign.status !== 200)
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
        
                    await recordModel.updateOne(
                        {patientId: user._id},
                        {$push: {appointments: newAppointment._id} },
                        {upsert:true}
                    )
                    
                    const foundRecord = await recordModel.findOne({patientId: user._id})
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
                    // return res.redirect('/dashboard/patient', 201)
                }
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "Error making appointment",
                data: error
            }
            
        }
    },
    //view medications
    viewMedication: async (data) => {
        try {
            const body = data.body;
            const foundUser = await userServices.getUserByCardNumber(body.cardNumber);
            const user = foundUser.data

            const records = await recordModel.findOne({patientId: user._id}).populate("appointments", "doctor appointmentDate appointmentTime symptoms")
            const medications = records.medications;
            return {
                status: 200,
                message: `You currently have ${medications.length} medications`,
                data: medications
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error getting appointment',
                data: error
            }
        }
        
    },

    //create/update records 
    createRecord: async (data) => {
        try {
            const body = data.body
            const patientId = body.patientId
            const newRecord = await recordModel.updateOne(
                {patientId},
                {body},
                {upsert:true}
            );

            const foundRecord = await recordModel.findById({_id: newRecord._id})
            if(!foundRecord) {
                return {
                    status: 404,
                    message: 'Record not found',
                }   
            }

            return {
                status: 200,
                message: 'Record created successfully',
                data: foundRecord
            }            
        } catch (error) {
            return {
                status: 500,
                message: 'error creating record',
                data: error
            } 
        }
    },

    //create/update medication
    createMedication: async (data) => {
        try {
            const {type, description, name, dosage, patientId} = data.body
            const medicationObject = {
                type,
                description,
                name,
                dosage
            }
            const newMedication = await recordModel.updateOne(
                {patientId},
                {$push : {medications : medicationObject}},
                {upsert:true}
            );

            const foundMedication = await recordModel.findById({_id:newMedication._id});
            if(!foundMedication) {
                return {
                    status: 404,
                    message: 'Record not found',
                }   
            }

            return {
                status: 200,
                message: 'medications added',
                data: foundMedication
            }
            
        } catch (error) {
            return {
                status: 500,
                message: 'error updating medication',
                data: error
            } 
        }
    }
}
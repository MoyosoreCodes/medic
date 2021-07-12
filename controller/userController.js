const userDB = require('../database/userDB').User;
const recordModel = require('../model/recordModel').Records;

module.exports = {
    //view medications
    viewMedication: async (data) => {
        try {
            const body = data.body;
            const foundUser = await userServices.getUserByCardNumber(body.cardNumber);
            const user = foundUser.data

            const records = await recordModel.findOne({patientId: user._id}).populate("appointments", "doctor appointmentDate appointmentTime symptoms")
            const medications = records.medications;

            if(!medications || medications == null || medications.isEmpty()){
                return {
                    status: 404,
                    message: 'You currently have no medications',
                    data: null
                }
            }

            return {
                status: 200,
                message: `You currently have ${medications.length} medications`,
                data: medications
            }
            // create a mapping function to map each medications
            //sth like this
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
            const _id = body._id
            const newRecord = await recordModel.updateOne(
                {patientId: _id},
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
            const {medicationObject, _id} = data.body
    
            const newMedication = await recordModel.updateOne(
                {patientId: _id},
                {"push" : {medications : medicationObject}},
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
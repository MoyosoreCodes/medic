const userDB = require('../database/userDB').User;
const recordModel = require('../model/recordModel').Records;

module.exports = {
    //view medications
    viewMedication: async (data) => {
        try {
            const body = data.body;
            const foundUser = await userServices.getUserByCardNumber(body.cardNumber);
            const user = foundUser.data

            const records = await recordModel.findOne({patientId: user._id})
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
        const body = data.body

        const newRecord = await recordModel.updateOne({
            patientId: user._id
        }, {
            body
        },{upsert:true})
        return {
            status: 200,
            message: 'Appointments created successfully',
            data: newRecord
        }
    }
}
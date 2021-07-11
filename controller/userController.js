const {User} = require('../database/userDB');
const {Session} = require('../model/sessionModel');
const userServices = require('../services/userServices');

module.exports = {
    //create/update records 
    createUserSession: async (data) => {
        const body = data.body
        const foundUser = await userServices.getPatientId(body.patientId);
        const user = foundUser.data
        const newRecord = await Session.create({
            patientId: user._id,
            //find data for records you can use them for medication
            observations: body.observations,
            treatment: body.treatment,
            intervention: body.intervention,
            topics_discussed: body.topics_discussed,  
            themes_discussed: body.themes_discussed,
            responses: body.responses,
        });

        const session = await Session.findOne({_id: newRecord._id})

        const updatedUser = await User.updateOne({
            _id: user._id,
        }, {sessions: session._id});

        return {
            status: 200,
            message: 'session created successfully',
            data: updatedUser
        }
    }
}
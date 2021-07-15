const {User} = require('../database/userDB');
const {Session} = require('../model/sessionModel');
const userServices = require('../services/userServices');

module.exports = {
    //create/update records 
    createUserSession: async (data) => {
        const body = data.body
        const foundUser = await userServices.getPatientId(body.patientId);
        if (foundUser.status !== 200)
        {
            return {
                status: foundUser.status,
                message: foundUser.message,
            }   
        }
        const newSession = await Session.create(body);
        
        const session = await Session.findOne({_id: newSession._id})

        const updatedUser = await User.updateOne({
            _id: user._id,
        }, {$push:{sessions: session._id}});

        return {
            status: 200,
            message: 'session created successfully',
            data: updatedUser
        }
    }
}
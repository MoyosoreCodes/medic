const userDB = require('../database/userDB').User;

module.exports = {
    //need to work on this
    //to list all appointments for a paticular patient or doctor depending on who logs in
    list: async (data) => {
        //to be used by everyone
        //may need to perform lookup
        //think this function will produce all user data
        try {
            const _id = data.user.toString();
            const user = await userDB.findOne({_id});
            
            //const _id = data.user._id;
            //const user_type = data.user.user_type;

            const userAppointment = await userDB.aggregate([
                    {$match: {_id}}, 
                    {
                        $lookup: {
                            from: 'appointments',
                            localField: 'appointments',
                            foreignField: `${user.user_type.toLowerCase()}`,
                            as: 'appointments' 
                        }
                    }
                ]);
            if(!userAppointment){
                console.log('error is at getting user data');
                return {
                    status: 500,
                    message: 'Appointment retrieval failed',
                    data: null
                }
            }

        } catch (error) {
            return {
                status: 500,
                message: 'Error getting appointment',
                data: error
            }
        }
        
    },

    //view medications

    //create/update records 
    createRecord: async () => {

    }
}
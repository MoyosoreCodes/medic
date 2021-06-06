const userModels = require('../model/userModel');
const userDB = require('../database/userDB');

module.exports = {
    addUser: async function(data){
      //dictionary access to user depending on the type of user passed in the request body
       let user_type = userModels.user_types[data.user_type]
       //let newUser = userDB[user_type](data);
       let newUser = userDB.User(data)

        //set health cared number if user is a patient
       if(user_type.toLowerCase() === userModels.user_types.PATIENT.toLowerCase()){      
            newUser.setHealthCardNumber();
       }
       // set password
       if(!newUser.setPassword(data.password)){
            console.log('error setting user password');
       }    
       
       let existingUser = await userDB.User.findOne({"email": data.email})

       if(existingUser){
        console.log("extra check to stop users from registering")
        return {
            'code':11000
        }
       }

        return await newUser.save().then(function (result,err) {
            if (result) {
                return result
            } else {
                return err
            }
        }).catch(function (err) {
                return err
        })
    },

    getUserById: async function (data, cb) {   
        try {
            const email = data.email;
            const _id = data._id;
        
        
            let dbUser = userDB.User;
            let query;
            if (data.email) {
                query = {email};
            } else {
                query = {_id};
            }

            const user = await dbUser.findOne(query);
            if(!user) {
                console.log('user does not exist');
            }
        } catch (error) {
            console.log(error);
            return error
        } 
    },

    deleteUser: async function (_id) {
        let dbUser = userDB.User;
        await dbUser.deleteOne({_id},function (err) {
            if(err){return err}
        });
        return true
    },
    
    updateUser: async function(data) {
        try {
            let user = userDB.User;
            return await user.updateOne({_id: data._id},
                data);
        }catch (e) {
            return e // promises do this already: catch just to return it.
        }
    }
}
const userModels = require('../model/userModel');
const userDB = require('../database/userDB');
const {Records, Medication} = require('../model/recordModel')

module.exports = {
    addUser: async function(data){
        try {       
            //let user_type = data.user_type
            let dbUser = userDB.User
            let email = data.email

            let existingUser = await dbUser.findOne({email})
        
            if(existingUser){
                console.log("extra check to stop users from registering")
                return {
                    'code':11000,
                    'message': "User already exists"
                }
            }
            let newUser = new dbUser(data);
     
             //set health cared number if user is a patient
            if(newUser.user_type.toUpperCase() === userModels.user_types.PATIENT){      
                 newUser.setHealthCardNumber()
                //  const medications = await Medication.create({patientId: newUser._id})
                 await Records.create({patientId:newUser._id})
            }
            //set availability status if user is a doctor
            if(newUser.user_type.toUpperCase() === userModels.user_types.DOCTOR){      
                newUser.isAvailable = true
            }    
            // set password
            const hashedpassword = await newUser.setPassword(data.password)
            if(hashedpassword) {
                newUser.password = hashedpassword
                console.log('password hashed successfully');
            }
            else{ console.log('could not hash password');}



            return await newUser.save().then(function (result,err) {
                if (result) {
                    return result
                } else {
                    return err
                }
            }).catch(function (err) {
                    return err
            })

        } catch (error) {
            return error
        }
    },
    getUserById: async function (data) {   
        try {
            const email = data.email;
            const _id = data._id;
        
        
            let dbUser = userDB.User;
            let query;
            if (email) {
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
    getPatientByCardNumber: async (cardNumber) => {

        try{
            let dbUser = userDB.User;
            cardNumber.trim();

            const user = await dbUser.findOne({cardNumber});
            //console.log(user);
            if(!user) {
                return {
                    status: 404,
                    message: 'User Data not Found',
                    data: null
                }
            }

            return {
                status: 200,
                message: 'User Data Found',
                data: user
            }
        }catch(err) {
            return {
                status: 500,
                message: 'error when retrieving user data',
                data: null
            }
        }

    },
    findAvailableDoctor: async () => {
        try {
            let query = {
                'isAvailable' : true, 
                'user_type': 'DOCTOR'
            }
            const dbUser = userDB.User;
            const availableDoctors = await dbUser.find(query) 
            //random doctor from all doctors
            if(!availableDoctors) {
                return {
                    status: 404,
                    message: 'no available doctors',
                    data: null
                }
            }
            console.log(availableDoctors.length);
            const ran = Math.floor(Math.random() * availableDoctors.length)
            console.log(ran);
            const randDoctor = availableDoctors[ran];

            return {
                status: 200,
                message: 'available doctor found',
                data: randDoctor
            }

        } catch (error) {
            return {
                status: 500,
                message: 'I could not find a doctor',
                data: error
            }
        }
        
    },
    deleteUser: async (_id) => {
        let dbUser = userDB.User;
        await dbUser.deleteOne({_id},function (err) {
            if(err){return err}
        });
        return true
    },
    updateUser: async (data) => {
        try {
            let user = userDB.User;
            return await user.updateOne({_id: data._id},
                data);
        }catch (e) {
            return e // promises do this already: catch just to return it.
        }
    }
}
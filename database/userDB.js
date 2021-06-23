const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GenericUserObject = require('../model/userModel').GenericUserObject;
const bcrypt = require('bcrypt');
const user_types = require('../model/userModel').user_types;

//function for setting user health card number
var setHealthCardNumber = function() {
    var length = 3;
    var result           = 'CU-HC';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.cardNumber = result;
    return true
};

//function for setting password
var setPassword = async function(password){
    try { 
        const hashedpassword = await bcrypt.hash(password, 8);
        //if process fails
        if(!hashedpassword || hashedpassword == undefined || hashedpassword == null){
            throw('Error hashing the password');
        }
        //if process is complete
        return hashedpassword
    } catch (err) {
        return err
    }
};

//function for validating password
var validatePassword = async function(password){
    try {  

        const match = await bcrypt.compare(password, this.password);
        if(!match) {
            throw('password does not match')
        }

        return match;

    } catch (err) {
        return err
    }
};

const userObject = GenericUserObject;
const userSchema = new Schema(userObject, {timestamps: true});
userSchema.methods.setHealthCardNumber = setHealthCardNumber;
userSchema.methods.setPassword = setPassword;
userSchema.methods.validatePassword = validatePassword;
//userSchema.plugin(require('mongoose-autopopulate'));
const User = mongoose.model('User', userSchema, 'users');

module.exports ={
    User
}

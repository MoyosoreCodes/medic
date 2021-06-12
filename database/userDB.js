const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GenericUserObject = require('../model/userModel').GenericUserObject;
const bcrypt = require('bcrypt');
const user_types = require('../model/userModel').user_types;

//function for setting user health card number
var setHealthCardNumber = function() {
    var length = 6;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.cardNumber = result;
    return true
};
/*
var getUserById = function (id, cb)  {
    this.findById(id, cb);
};

var getUsers =  (cb) => {
    this.find(cb)
};

var getUserByEmail = function (email, cb)  {
    const query = { email }
    this.findOne(query, cb);
};
*/
//function for setting password
var setPassword = async function(password){
    const hashedpassword = await bcrypt.hash(password, 8);
    if(!hashedpassword){
        console.log('error hashing password');   
        return false
    }
        this.password = hashedpassword;
        return true
};

//function for validating password
var validatePassword = function(email, password){
    const user = await this.findOne({email});
    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        console.log('password does not match');
        return false
    }

    return true
    //should it contain user email??
   // const match = bcrypt.compare(password);
};

const userObject = GenericUserObject;
const userSchema = new Schema(userObject, {timestamps: true});
userSchema.methods.setHealthCardNumber = setHealthCardNumber;
userSchema.methods.setPassword = setPassword;
userSchema.methods.validatePassword = validatePassword;
userSchema.plugin(require('mongoose-autopopulate'));
const User = mongoose.model('User', userSchema, 'users');

module.exports ={
    User, getUserByEmail,  getUserById, getUsers 
}

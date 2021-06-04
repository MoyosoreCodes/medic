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

var getUserById = function (id, cb)  {
    this.findById(id, cb);
};

var getUsers =  (cb) => {
    this.find(cb)
};

var getUserByEmail = function (username, cb)  {
    const query = { username: username }
    this.findOne(query, cb);
};

//function for setting password
var setPassword = function(password){
    const hashedpassword = await bcrypt.hash(password, 8);
    if(!hashedpassword){
        console.log('error hashing password');   
        return false
    }
        this.password = hashedpassword;
        return true
};

//function for validating password
var validatePassword = function(password){
    //should it contain user email??
   // const match = bcrypt.compare(password);
};



const patientObject = GenericUserObject;
patientObject.user_type.default = user_types.PATIENT
const patientSchema = new Schema(patientObject, {timestamps: true});
patientSchema.methods.setHealthCardNumber = setHealthCardNumber;
patientSchema.methods.setPassword = setPassword;

const customuserObject = GenericUserObject;
customuserObject.user_type.default = user_types.CLIENT
const customUserSchema = new Schema(customUserObject, {timestamps: true});
customUserSchema.methods.setPassword = setPassword;
customUserSchema.methods.getUserById = getUserById;
customUserSchema.methods.getUsers = getUsers;
customUserSchema.methods.getUserByEmail = getUserByEmail;

const nurseObject = GenericUserObject;
nurseObject.user_type.default = user_types.NURSE
const nurseSchema = new Schema(nurseObject, {timestamps: true});
nurseSchema.methods.setPassword = setPassword;

const doctorObject = GenericUserObject;
doctorObject.user_type.default = user_types.DOCTOR
const doctorSchema = new Schema(doctorObject, {timestamps: true});
doctorSchema.methods.setPassword = setPassword;

Doctor =  mongoose.model('Doctor', doctorSchema, 'users');
Patient =  mongoose.model('Patient', patientSchema, 'users');
CustomUser =  mongoose.model('CustomUser', customUserSchema, 'users');
Nurse =  mongoose.model('Nurse', nurseSchema, 'users');

module.exports ={
    Doctor, Patient, Nurse, CustomUser
}

/*
const userObject = GenericUserObject;
const userSchema = new Schema(userObject, {timestamps: true});
const User = mongoose.model('User', userSchema, 'users')

*/
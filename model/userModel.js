const mongoose = require('mongoose');
const Schema = mongoose.Schema

const user_types = {
    DOCTOR: 'DOCTOR',
    CLIENT: 'CLIENT',
    NURSE: 'NURSE',
    PATIENT: 'PATIENT'
};

const GenericAddress = {
    full_address: {type: String,trim: true}
}

const GenericUserObject = {
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: Number,
    qualification: String,
    user_type: {
        type: String,
        default: user_types.PATIENT
    },
    address: GenericAddress
};

const patientObject = GenericUserObject;
patientObject.user_type.default = user_types.PATIENT
const patientSchema = new Schema(patientObject, {timestamps: true});

const customuserObject = GenericUserObject;
customuserObject.user_type.default = user_types.CLIENT
const customUserSchema = new Schema(customUserObject, {timestamps: true});

const nurseObject = GenericUserObject;
nurseObject.user_type.default = user_types.NURSE
const nurseSchema = new Schema(nurseObject, {timestamps: true});

const doctorObject = GenericUserObject;
doctorObject.user_type.default = user_types.ADMIN
const doctorSchema = new Schema(doctorObject, {timestamps: true});

const Doctor =  mongoose.model('Doctor', doctorSchema, 'users');
const Patient =  mongoose.model('Patient', patientSchema, 'users');
const CustomUser =  mongoose.model('CustomUser', customUserSchema, 'users');
const Nurse =  mongoose.model('Nurse', nurseSchema, 'users');

module.exports ={
    Doctor, Patient, CustomUser, Nurse
}
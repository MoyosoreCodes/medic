const mongoose = require('mongoose');
const Schema = mongoose.Schema

const user_types = {
    DOCTOR: 'DOCTOR',
    ADMIN: 'ADMIN',
    NURSE: 'NURSE',
    PATIENT: 'PATIENT'
};

const GenericUserObject = {
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        //default: user_types.PATIENT
    }
};

const patientObject = GenericUserObject;
patientObject.user_type.default = user_types.PATIENT
const patientSchema = new Schema(patientObject, {timestamps: true});

const doctorObject = GenericUserObject;
doctorObject.user_type.default = user_types.DOCTOR
const doctorSchema = new Schema(doctorObject, {timestamps: true});

const nurseObject = GenericUserObject;
nurseObject.user_type.default = user_types.NURSE
const nurseSchema = new Schema(nurseObject, {timestamps: true});

const adminObject = GenericUserObject;
adminObject.user_type.default = user_types.ADMIN
const adminSchema = new Schema(adminObject, {timestamps: true});

const Admin =  mongoose.model('Admin', adminSchema, 'users');
const Patient =  mongoose.model('Patient', patientSchema, 'users');
const Doctor =  mongoose.model('Doctor', doctorSchema, 'users');
const Nurse =  mongoose.model('Nurse', nurseSchema, 'users');

module.exports ={
    Admin, Patient, Doctor, Nurse
}
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const medicationObject = {
    type:{type: String, default: 'N/A'},
    description:{type: String, default: 'N/A'},
    name:{type: String, default: 'N/A'},
    dosage: {type: String, default: 'N/A'}
}
// const medicationSchema = Schema(medicationObject, {timestamps: true});
// //userRecordSchema.plugin(require('mongoose-autopopulate'));
// const Medication =  mongoose.model('Medication', medicationSchema, 'medications');

const userRecordObject = {
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:true
    },
    observations: {type: String, default: 'PENDING'},
    blood_type: {type: String, default: 'N/A'},
    blood_pressure: {type: String, default: 'N/A'},
    allergies: {type: String, default: 'N/A'},
    genotype: {type: String, default: 'N/A'},
    temperature: {type: String, default: 'N/A'},
    weight: {type: String, default: 'N/A'},
    medications: [medicationObject],
    pulse_rate: {type: String, default: 'N/A'},
    consultation_date:{type: String, default: 'N/A'},
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: 'appointments',
        //autopopulate:true
    }]
}
const userRecordSchema = Schema(userRecordObject, {timestamps: true});
//userRecordSchema.plugin(require('mongoose-autopopulate'));
const Records =  mongoose.model('Records', userRecordSchema, 'records');
module.exports = {userRecordObject, Records}
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userRecordObject = {
    patientId: [{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        autopopulate:true
    }],
    //find data for records you can use them for medication
    observations: {type: String, default: 'PENDING'},
    blood_type: {type: String, default: 'N/A'},
    blood_pressure: {type: String, default: 'N/A'},
    allergies: {type: String, default: 'N/A'},
    genotype: {type: String, default: 'N/A'},
    temperature: {type: String, default: 'N/A'},
    weight: {type: String, default: 'N/A'},
    medications: {type: String, default: 'N/A'},
    pulse_rate: {type: String, default: 'N/A'},
    consultion_date:String
}
const userRecordSchema = Schema(userRecordObject, {timestamps: true});
const Departments =  mongoose.model('Records', userRecordSchema, 'records');
module.exports = {userRecordObject, Departments}
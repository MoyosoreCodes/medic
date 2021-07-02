const mongoose = require('mongoose');
const Schema = mongoose.Schema

const appointment_types = {
    FOLLOW_UP: 'FOLLOW_UP' ,
    NEW_CASE: 'NEW_CASE',
    ROUTINE_CHECK: 'ROUTINE_CHECK'
};

const appointmentObject = {
    appointment_type: {
        type: String,
        default: appointment_types.NEW_CASE,
        trim: true
    },
    patient: [{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    }],
    appointmentDate: String,
    appointmentTime: String,
    symptoms: String,
    doctor:[{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    }],
};

const appointmentSchema = Schema(appointmentObject, {timestamps: true});
//appointmentSchema.plugin(require('mongoose-autopopulate'));
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment
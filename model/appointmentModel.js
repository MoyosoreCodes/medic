const mongoose = require('mongoose');
const Schema = mongoose.Schema

const appointment_types = {
    FOLLOW_UP: 'FOLLOW_UP' ,
    NEW_CASE: 'NEW_CASE',
    ROUTINE_CHECK: 'ROUTINE_CHECK'
};

const appointment_status = {
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED',
    APPROVED: 'APPROVED'
}

const appointmentObject = {
    appointment_type: {
        type: String,
        default: appointment_types.NEW_CASE,
        trim: true
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    appointmentDate: String,
    appointmentTime: String,
    symptoms: String,
    doctor:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    status: {type: String, default: appointment_status.PENDING}
};

const appointmentSchema = Schema(appointmentObject, {timestamps: true});
//appointmentSchema.plugin(require('mongoose-autopopulate'));
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment, appointment_types, appointment_status}
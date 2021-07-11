const mongoose = require('mongoose');
const Schema = mongoose.Schema

const appointment_status = {
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED',
    APPROVED: 'APPROVED'
}

const appointmentObject = {
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    appointmentDate: String,
    appointmentTime: String,
    symptoms: String,
    counsellor:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    status: {type: String, default: appointment_status.PENDING}
};

const appointmentSchema = Schema(appointmentObject, {timestamps: true});
//appointmentSchema.plugin(require('mongoose-autopopulate'));
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment, appointment_status}
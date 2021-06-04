const mongoose = require('mongoose');

const appointment_types = {
    FOLLOW_UP: 'FOLLOW_UP' ,
    NEW_CASE: 'NEW_CASE',
    ROUTINE_CHECK: 'ROUTINE_CHECK'
};

const appointmentObject = {
    type: {
        type: String,
        enum: ['ONLINE', 'CLINC'],
        trim: true
    },
    appointment_type: {
        type: String,
        default: appointment_types.NEW_CASE,
        trim: true
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    appointmentDate: {type: Date,default: Date.now()},
    appointmentTime:String,
    comments:String,
    prefferred_personnel: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    department: {
        type: mongoose.Types.ObjectId,
        ref: 'departments',
        autopopulate:true
    }
};
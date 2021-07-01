const mongoose = require("mongoose");

const user_types = {
    DOCTOR: 'DOCTOR',
    PATIENT: 'PATIENT'
};

/*const GenericPaymentDetails ={
    card_type:String,
    last4: String,
    first6: String,
    cvv:String, 
    bank_name: {type: String,trim: true},
    account_holder_name: {type: String,trim: true},
    account_number: {type: String,trim: true},
}*/

const GenericUserObject = {
    first_name: {type: String,trim: true, required: [true,'please provide first name'], index:true},
    last_name: {type: String,trim: true, required: [true,'please provide last name'], index:true},
    email: {type: String,trim: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type:String, required:[true,'please provide password']},
    phoneNumber: String,
    cardNumber:String,
    //doctors only
    qualification: String,
    specialities: [String],
    user_type: {type: String,default: user_types.PATIENT},
    address: {full_address:String},
    last_login: {type: Date, default: Date.now()},
    //payment_details: GenericPaymentDetails,
    gender:String,
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: 'appointments',
        autopopulate: true
    }],
    records: [{
        type: mongoose.Types.ObjectId,
        ref: 'records',
        autopopulate: true
    }],
    //image: { type: Object, trim: true},
    //for doctors only
    isAvailable: {type: Boolean}
};

module.exports={
    GenericUserObject, user_types
}
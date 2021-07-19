const mongoose = require("mongoose");

const user_types = {
    DOCTOR: 'DOCTOR',
    PATIENT: 'PATIENT'
};
const GenericUserObject = {
    first_name: {type: String,trim: true, required: [true,'please provide first name'], index:true},
    last_name: {type: String,trim: true, required: [true,'please provide last name'], index:true},
    email: {type: String,trim: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type:String, required:[true,'please provide password']},
    phoneNumber: String,
    cardNumber:String,
    //doctors only
    qualification: String,
    specialties: [String],
    user_type: {type: String,default: user_types.PATIENT},
    address: String,
    last_login: {type: String, default: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') },
    //payment_details: GenericPaymentDetails,
    gender:String,
    records: {
        type: mongoose.Types.ObjectId,
        ref: 'records',
        //autopopulate: true
    },
    //image: { type: Object, trim: true},
    //for doctors only
    isAvailable: {type: Boolean}
};

module.exports={
    GenericUserObject, user_types
}
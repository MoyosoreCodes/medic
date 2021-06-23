const mongoose = require("mongoose");

const user_types = {
    DOCTOR: 'DOCTOR',
    NURSE: 'NURSE',
    PATIENT: 'PATIENT'
};

const userRecords = { 
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
    patient: String,
    doctor: String,
    consultion_date: {type: String, default: Date.now()}
}

const GenericPaymentDetails ={
    card_type:String,
    last4: String,
    first6: String,
    cvv:String, 
    bank_name: {type: String,trim: true},
    account_holder_name: {type: String,trim: true},
    account_number: {type: String,trim: true},
}

const GenericUserObject = {
    first_name: {type: String,trim: true, required: [true,'please provide first name'], index:true},
    last_name: {type: String,trim: true, required: [true,'please provide last name'], index:true},
    email: {type: String,trim: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type:String, required:[true,'please provide password']},
    phoneNumber: Number,
    cardNumber:String,
    //doctors only
    qualification: String,
    specialities: [String],
    user_type: {type: String,default: user_types.PATIENT},
    address: {full_address:String},
    last_login: {type: Date, default: Date.now()},
    payment_details: GenericPaymentDetails,
    gender:String,
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: 'appointments',
        autopopulate: true
    }],
    department: {
        type: mongoose.Types.ObjectId,
        ref: 'departments',
        autopopulate:true
    },
    records: userRecords,
    //image: { type: Object, trim: true},
    //for doctors only
    isAvailable: {type: Boolean}
};

module.exports={
    GenericUserObject, user_types
}
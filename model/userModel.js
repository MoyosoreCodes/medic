const user_types = {
    DOCTOR: 'DOCTOR',
    //CLIENT: 'CLIENT',
    NURSE: 'NURSE',
    PATIENT: 'PATIENT'
};

const GenericAddress = {
    full_address: {type: String,trim: true}
},
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
    first_name: {type: String,trim: true, required: [true,'please provide first name']},
    last_name: {type: String,trim: true, required: [true,'please provide last name']},
    email: {type: String,trim: true, lowercase: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type:String, required:[true,'please provide password'], select : false},
    phoneNumber: Number,
    cardNumber: {type:String},
   // qualification: String,
    user_type: {type: String,default: user_types.PATIENT},
    address: GenericAddress,
    last_login: {type: Date, default: Date.now()},
    payment_details: GenericPaymentDetails
};

module.exports={
    GenericUserObject, user_types
}
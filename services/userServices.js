const {Admin, Patient, Doctor, Nurse} = require('../model/userModel');

module.exports = {
    createDoctor: async (data) => {
        //const createdDoctor =  await Doctor.create(data);

    }, 
    createPatients: async (data) => {
        //const createdPatient =  await Patient.create(data);
    },  
    createNurse: async (data) => {
        //const createdNurse =  await Nurse.create(data);
    },
    removeDoctor: async (data) => {
         await Doctor.remove(data);
    },
}
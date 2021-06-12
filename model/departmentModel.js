const mongoose = require("mongoose")
const Schema = mongoose.Schema

const departmentObject = {
    personnel: [{
        type: mongoose.Types.ObjectId,
        ref: 'departments',
        autopopulate:true
    }],
    name: String
}
const departmentSchema = Schema(departmentObject, {timestamps: true});
const Departments =  mongoose.model('Department', departmentSchema);
module.exports = {departmentObject, Departments}
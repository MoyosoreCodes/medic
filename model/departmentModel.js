const mongoose = require("mongoose")
const Schema = mongoose.Schema

const departmentObject = {
    users: [{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        autopopulate:true
    }],
    name: String
}
const departmentSchema = Schema(departmentObject, {timestamps: true});
const Departments =  mongoose.model('Department', departmentSchema);
module.exports = {departmentObject, Departments}
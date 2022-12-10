const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim:true,
        required: true
    },
    lname: {
        type: String,
        trim:true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    address: {
        type:String,
        required:true,
        trim:true
    },
    country: {
        type:String,
        required:true,
        trim:true
    },
    state: {
        type:String,
        required:true,
        trim:true
    },
    city: {
        type:String,
        required:true,
        trim:true
    },
    zipcode: {
        type:Number,
        required:true,
        trim:true
    },
    profile:{
        type:String,
        required:true,
        trim:true
    }

},{timestamps: true });

module.exports = mongoose.model('customer',customerSchema)
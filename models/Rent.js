const mongoose = require('mongoose');
const CarRental = require('./CarRental');

const RentSchema=new mongoose.Schema ({
    startDate: {
        type: Date,
        required:true
    },
    endDate: {
        type: Date,
        required:true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: 'CarRental',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Rent', RentSchema);
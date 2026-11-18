const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength:30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength:40
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength:30
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    },
    category: {
        type: String,
        required: true,
        enum: ['Personal', 'Family', 'Friends', 'Business', 'Other'],
        default: 'Other'
    }
},{
    timestamps: true
})

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
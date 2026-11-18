
const Contact = require('../models/Contact');
const mongoose = require('mongoose');

// Normalize values before comparing duplicates
const normalizeEmail = (email) =>
    String(email || '').trim().toLowerCase();

const normalizePhone = (phone) =>
    String(phone || '').replace(/[\s()-]/g, '');

// Reusable error handler
const handleError = (res, error) => {
    console.error(error);

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Email or phone number already exists'
        });
    }

    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};


// GET ALL CONTACTS
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            contacts
        });

    } catch (error) {
        handleError(res, error);
    }
};


// CREATE CONTACT
const createContact = async (req, res) => {
    try {
        const { name, email, phone, address, category } = req.body;

        const normalizedEmail = normalizeEmail(email);
        const normalizedPhone = normalizePhone(phone);

        // Check for existing email or phone
        const existingContact = await Contact.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone }
            ]
        });

        if (existingContact) {
            return res.status(409).json({
                success: false,
                message: 'Email or phone number already exists'
            });
        }

        const newContact = new Contact({
            name,
            email: normalizedEmail,
            phone: normalizedPhone,
            address: {
                street: address?.street || '',
                city: address?.city || '',
                state: address?.state || '',
                pincode: address?.pincode || ''
            },
            category
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            contact: newContact
        });

    } catch (error) {
        handleError(res, error);
    }
};


// GET SINGLE CONTACT
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            contact
        });

    } catch (error) {
        handleError(res, error);
    }
};


// UPDATE CONTACT
const editContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
        }

        const { name, email, phone, address, category } = req.body;

        const normalizedEmail = normalizeEmail(email);
        const normalizedPhone = normalizePhone(phone);

        // Find another contact with the same email or phone.
        // _id: { $ne: id } excludes the contact being edited.
        const existingContact = await Contact.findOne({
            _id: { $ne: id },
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone }
            ]
        });

        if (existingContact) {
            return res.status(409).json({
                success: false,
                message: 'Email or phone number already exists'
            });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.name = name;
        contact.email = normalizedEmail;
        contact.phone = normalizedPhone;
        contact.address = {
            street: address?.street || '',
            city: address?.city || '',
            state: address?.state || '',
            pincode: address?.pincode || ''
        };
        contact.category = category;

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            contact
        });

    } catch (error) {
        handleError(res, error);
    }
};


// DELETE CONTACT
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        handleError(res, error);
    }
};


module.exports = {
    getContacts,
    createContact,
    getContactById,
    editContact,
    deleteContact
};

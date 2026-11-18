
const express = require('express');
const router = express.Router();

const {
    getContacts,
    createContact,
    getContactById,
    editContact,
    deleteContact
} = require('../controllers/contactController');

// GET all contacts
router.get('/', getContacts);

// CREATE a contact
router.post('/', createContact);

// GET a single contact
router.get('/:id', getContactById);

// UPDATE a contact
router.put('/:id', editContact);

// DELETE a contact
router.delete('/:id', deleteContact);

module.exports = router;

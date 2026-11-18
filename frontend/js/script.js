
// ==========================================
// 1. DOM ELEMENTS
// ==========================================

const contactForm = document.querySelector('#contactForm');
const contactsList = document.querySelector('#contactsList');
const submitBtn = document.querySelector('#submitBtn');
const cancelBtn = document.querySelector('#cancelBtn');
const formTitle = document.querySelector('#formTitle');

const searchInput = document.querySelector('#searchInput');
const categoryFilter = document.querySelector('#categoryFilter');

const contactModal = document.querySelector('#contactModal');
const closeModal = document.querySelector('#closeModal');

const API_URL = 'http://localhost:3000/api/contacts';

let editingId = null;
let allContacts = [];


// ==========================================
// 2. GET ALL CONTACTS
// ==========================================

const getContacts = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch contacts');
        }

        allContacts = data.contacts || [];

        filterContacts();

    } catch (error) {
        console.error('Get contacts error:', error);
        contactsList.textContent = 'Unable to load contacts.';
    }
};


// ==========================================
// 3. DISPLAY CONTACTS
// ==========================================

const displayContacts = (contacts) => {
    contactsList.innerHTML = '';

    if (contacts.length === 0) {
        contactsList.textContent = 'No contacts found.';
        return;
    }

    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.classList.add('contact-card');

        const name = document.createElement('h3');
        name.textContent = contact.name;

        const email = document.createElement('p');
        email.textContent = `Email: ${contact.email}`;

        const phone = document.createElement('p');
        phone.textContent = `Phone: ${contact.phone}`;

        const category = document.createElement('p');
        category.textContent = `Category: ${contact.category}`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.dataset.id = contact._id;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.dataset.id = contact._id;

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Details';
        viewBtn.classList.add('view-btn');
        viewBtn.dataset.id = contact._id;

        card.append(
            name,
            email,
            phone,
            category,
            editBtn,
            deleteBtn,
            viewBtn
        );

        contactsList.appendChild(card);
    });
};


// ==========================================
// 4. FILTER CONTACTS
// ==========================================

const filterContacts = () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredContacts = allContacts.filter(contact => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchValue) ||
            contact.email.toLowerCase().includes(searchValue) ||
            contact.phone.includes(searchValue);

        const matchesCategory =
            selectedCategory === 'All' ||
            contact.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayContacts(filteredContacts);
};


// ==========================================
// 5. VIEW CONTACT DETAILS
// ==========================================

const showDetails = (contactId) => {
    const contact = allContacts.find(
        contact => contact._id === contactId
    );

    if (!contact) return;

    document.querySelector('#detailName').textContent = contact.name;
    document.querySelector('#detailEmail').textContent = contact.email;
    document.querySelector('#detailPhone').textContent = contact.phone;
    document.querySelector('#detailCategory').textContent = contact.category;

    document.querySelector('#detailStreet').textContent =
        contact.address?.street || '-';

    document.querySelector('#detailCity').textContent =
        contact.address?.city || '-';

    document.querySelector('#detailState').textContent =
        contact.address?.state || '-';

    document.querySelector('#detailPincode').textContent =
        contact.address?.pincode || '-';

    document.querySelector('#detailCreatedAt').textContent =
        contact.createdAt
            ? new Date(contact.createdAt).toLocaleString()
            : '-';

    document.querySelector('#detailUpdatedAt').textContent =
        contact.updatedAt
            ? new Date(contact.updatedAt).toLocaleString()
            : '-';

    contactModal.style.display = 'flex';
};


// ==========================================
// 6. RESET FORM
// ==========================================

const resetForm = () => {
    contactForm.reset();

    editingId = null;

    formTitle.textContent = 'Add New Contact';
    submitBtn.textContent = 'Create Contact';
    cancelBtn.hidden = true;
};


// ==========================================
// 7. CREATE AND UPDATE CONTACT
// ==========================================

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const contactData = {
        name: document.querySelector('#name').value.trim(),
        email: document.querySelector('#email').value.trim(),
        phone: document.querySelector('#phone').value.trim(),

        address: {
            street: document.querySelector('#street').value.trim(),
            city: document.querySelector('#city').value.trim(),
            state: document.querySelector('#state').value.trim(),
            pincode: document.querySelector('#pincode').value.trim()
        },

        category: document.querySelector('#category').value
    };

    try {
        submitBtn.disabled = true;

        const response = await fetch(
            editingId ? `${API_URL}/${editingId}` : API_URL,
            {
                method: editingId ? 'PUT' : 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(contactData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Operation failed');
        }

        alert(result.message);

        resetForm();
        await getContacts();

    } catch (error) {
        alert(error.message);

    } finally {
        submitBtn.disabled = false;
    }
});


// ==========================================
// 8. CONTACT CARD BUTTON EVENTS
// ==========================================

contactsList.addEventListener('click', async (event) => {

    const button = event.target.closest('button');

    if (!button || !contactsList.contains(button)) return;

    const id = button.dataset.id;

    if (!id) return;


    // EDIT CONTACT

    if (button.classList.contains('edit-btn')) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch contact');
            }

            const contact = data.contact;

            editingId = id;

            document.querySelector('#name').value = contact.name;
            document.querySelector('#email').value = contact.email;
            document.querySelector('#phone').value = contact.phone;

            document.querySelector('#street').value =
                contact.address?.street || '';

            document.querySelector('#city').value =
                contact.address?.city || '';

            document.querySelector('#state').value =
                contact.address?.state || '';

            document.querySelector('#pincode').value =
                contact.address?.pincode || '';

            document.querySelector('#category').value = contact.category;

            formTitle.textContent = 'Edit Contact';
            submitBtn.textContent = 'Update Contact';
            cancelBtn.hidden = false;

            contactForm.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            alert(error.message);
        }
    }


    // DELETE CONTACT

    else if (button.classList.contains('delete-btn')) {

        const confirmDelete = confirm(
            'Are you sure you want to delete this contact?'
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete contact');
            }

            alert(result.message);

            if (editingId === id) {
                resetForm();
            }

            await getContacts();

        } catch (error) {
            alert(error.message);
        }
    }


    // VIEW CONTACT DETAILS

    else if (button.classList.contains('view-btn')) {
        showDetails(id);
    }

});


// ==========================================
// 9. MODAL EVENTS
// ==========================================

closeModal.addEventListener('click', () => {
    contactModal.style.display = 'none';
});

contactModal.addEventListener('click', (event) => {
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
    }
});


// ==========================================
// 10. OTHER EVENT LISTENERS
// ==========================================

cancelBtn.addEventListener('click', resetForm);

searchInput.addEventListener('input', filterContacts);

categoryFilter.addEventListener('change', filterContacts);


// ==========================================
// 11. INITIALIZE APPLICATION
// ==========================================

getContacts();

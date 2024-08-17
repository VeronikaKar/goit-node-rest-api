import Contact from "../models/contacts.js"; // Ensure the correct model path

// Get all contacts
export const getContacts = () => {
  return Contact.find({}, "-createdAt -updatedAt"); // Optionally exclude createdAt and updatedAt fields
};

// Get a contact by ID
export const getContactById = (contactId) => {
  return Contact.findById(contactId);
};

// Add a new contact
export const addContact = (data) => {
  const { name, email, phone, favorite = false } = data; // Default favorite to false if not provided
  return Contact.create({ name, email, phone, favorite });
};

// Update a contact by ID
export const updateContactById = (contactId, updates) => {
  return Contact.findByIdAndUpdate(contactId, updates, { new: true }); // Return the updated document
};

// Delete a contact by ID
export const deleteContactById = (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

// Update the favorite status of a contact
export const updateFavoriteStatus = (contactId, { favorite }) => {
  return Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};

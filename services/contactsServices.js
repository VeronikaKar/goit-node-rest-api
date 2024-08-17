import Contact from "../models/contacts.js"; 


export const getContacts = () => {
  return Contact.find({}, "-createdAt -updatedAt");
};


export const getContactById = (contactId) => {
  return Contact.findById(contactId);
};


export const addContact = (data) => {
  const { name, email, phone, favorite = false } = data; // 
  return Contact.create({ name, email, phone, favorite });
};


export const updateContactById = (contactId, updates) => {
  return Contact.findByIdAndUpdate(contactId, updates, { new: true }); 
};


export const deleteContactById = (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};


export const updateFavoriteStatus = (contactId, { favorite }) => {
  return Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};

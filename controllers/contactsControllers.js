import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};


export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw new HttpError(404, "Not Found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error); 
  }
};


export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);
    if (!removedContact) {
      throw new HttpError(404, "Not Found");
    }
    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};


export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};


export const updateContactHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      throw new HttpError(400, "Body must have at least one field");
    }

    const updatedContact = await updateContactService(id, {
      name,
      email,
      phone,
    });
    if (!updatedContact) {
      throw new HttpError(404, "Not Found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

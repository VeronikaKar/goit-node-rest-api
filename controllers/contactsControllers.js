import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService, 
} from "../services/contactsServices.js";
import {
  contactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import HttpError from "../helpers/HttpError.js";


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};


export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404, "Not Found"));
    }
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};


export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const removedContact = await removeContact(id);
    if (removedContact) {
      res.status(200).json(removedContact);
    } else {
      next(HttpError(404, "Not Found"));
    }
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};


export const validateCreateContact = validateBody(contactSchema);


export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};


export const validateUpdateContact = validateBody(updateContactSchema);


export const updateContactHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return next(HttpError(400, "Body must have at least one field"));
  }

  try {
    const updatedContact = await updateContactService(id, {
      name,
      email,
      phone,
    });
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      next(HttpError(404, "Not Found"));
    }
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

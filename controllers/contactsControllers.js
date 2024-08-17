import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const result = await contactsServices.getContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.getContactById(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const createContact = async (req, res) => {
  const result = await contactsServices.addContact(req.body);
  res.status(201).json(result);
};

const updateContactHandler = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.updateContactById(id, req.body);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.deleteContactById(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({ message: "Delete success" });
};

const updateFavoriteStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updatedContact = await contactsServices.updateFavoriteStatus(
    contactId,
    { favorite }
  );

  if (!updatedContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContactHandler: ctrlWrapper(updateContactHandler),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus),
};

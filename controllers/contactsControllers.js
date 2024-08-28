import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as contactsServices from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite) {
    query.favorite = favorite === "true";
  }

  const result = await contactsServices.getContacts(query, { skip, limit });
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.getOneContact({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const add = async (req, res) => {
  const { path: oldPath, filename } = req.file || {};
  let avatar = null;

  if (filename) {
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    avatar = path.join("avatars", filename);
  }

  const { _id: owner } = req.user;

  const result = await contactsServices.addContact({
    ...req.body,
    avatar,
    owner,
  });

  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    req.body.avatar = path.join("avatars", filename);
  }

  const result = await contactsServices.updateContactById(
    { _id: id, owner },
    req.body
  );

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsServices.deleteContactById({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    message: "Delete success",
  });
};

const updateFavoriteStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id: owner } = req.user;

  const result = await contactsServices.updateFavoriteStatus(
    { _id: contactId, owner },
    { favorite }
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus),
};

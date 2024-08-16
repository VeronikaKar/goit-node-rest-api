import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
} from "../controllers/contactsControllers.js";
import {
  contactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const router = express.Router();

router.post("/", validateBody(contactSchema), createContact);

router.put("/:id", validateBody(updateContactSchema), updateContactHandler);

router.get("/", getAllContacts);

router.get("/:id", getOneContact);

router.delete("/:id", deleteContact);

export default router;

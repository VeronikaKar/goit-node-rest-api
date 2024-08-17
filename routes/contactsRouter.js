import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidid.js";

const router = express.Router();

router.post(
  "/",
  validateBody(contactAddSchema),
  contactsControllers.createContact
);
router.put(
  "/:id",
  isValidId,
  validateBody(contactUpdateSchema),
  contactsControllers.updateContactHandler
);
router.get("/", contactsControllers.getAllContacts);
router.get("/:id", isValidId, contactsControllers.getOneContact);
router.delete("/:id", isValidId, contactsControllers.deleteContact);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(contactUpdateFavoriteSchema),
  contactsControllers.updateFavoriteStatus
);

export default router;

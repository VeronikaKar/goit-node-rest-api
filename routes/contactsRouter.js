import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", contactsControllers.getAll);
router.post("/", validateBody(contactAddSchema), contactsControllers.add);
router.get("/:id", isValidId, contactsControllers.getById);
router.put(
  "/:id",
  isValidId,
  validateBody(contactUpdateSchema),
  contactsControllers.updateById
);
router.delete("/:id", isValidId, contactsControllers.deleteById);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(contactUpdateFavoriteSchema),
  contactsControllers.updateFavoriteStatus
);

export default router;

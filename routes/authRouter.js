import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", authenticate, contactsControllers.getAll);
router.post(
  "/",
  authenticate,
  validateBody(contactAddSchema),
  contactsControllers.add
);
router.get("/:id", authenticate, isValidId, contactsControllers.getById);
router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(contactUpdateSchema),
  contactsControllers.updateById
);
router.delete("/:id", authenticate, isValidId, contactsControllers.deleteById);
router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(contactUpdateFavoriteSchema),
  contactsControllers.updateFavoriteStatus
);

export default router;

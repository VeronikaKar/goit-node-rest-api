import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", authenticate, contactsControllers.getAll);

router.post(
  "/",
  authenticate,
  upload.single("avatar"),
  validateBody(contactAddSchema),
  contactsControllers.add
);

router.get("/:id", authenticate, isValidId, contactsControllers.getById);

router.put(
  "/:id",
  authenticate,
  isValidId,
  upload.single("avatar"),
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

router.patch(
  "/:id/avatar",
  authenticate,
  isValidId,
  upload.single("avatar"),
  contactsControllers.updateAvatar
);

export default router;

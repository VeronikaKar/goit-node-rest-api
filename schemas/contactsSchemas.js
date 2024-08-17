import Joi from "joi";

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})
  .or("name", "email", "phone", "favorite")
  .messages({
    "object.missing": "At least one field must be updated",
  });

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "Favorite status is required",
  }),
});

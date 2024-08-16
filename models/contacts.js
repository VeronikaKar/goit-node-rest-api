import { Schema, model } from "mongoose";
import { contactSchema } from "../schemas/contactsSchemas";
const ContactSchema = newSchema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const Contact = model("contact", contactSchema);
export default Contact;

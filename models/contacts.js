const { Schema, model } = require("mongoose"); // Import the Mongoose Schema and model
const Joi = require("joi"); 
// Define the Mongoose contactSchema for the 'contacts' collection
const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"], // Name field is required with a custom error message if not provided
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false, // The 'favorite' field defaults to 'false' if not provided
    },
        owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true } // Disable the '__v' field and enable timestamps (createdAt, updatedAt)
);

// Define the Joi schema for data validation when adding a new contact
const joiSchema = Joi.object({
  name: Joi.string().required(), // Name field is required and should be a string
  email: Joi.string().required(), // Email field is required and should be a string
  phone: Joi.string().required(), // Phone field is required and should be a string
  favorite: Joi.bool(), // Favorite field is optional and should be a boolean
});

// Create the Mongoose Contact model from the contactSchema
const Contact = model("contacts", contactSchema);

// Export the Contact model and the Joi schemas to be used in other parts of the application
module.exports = {
  Contact,
  joiSchema,
};



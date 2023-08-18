// Import required modules: Express, controller functions from '../controllers', and the middleware 'ctrlWrapper' from '../middlewares'.
const express = require("express");
const { contacts: ctrl } = require("../../controllers");
const { validation, ctrlWrapper } = require("../../middlewares");
const { joiSchema } = require("../../models/contacts");

// Create an instance of the Express Router.
const router = express.Router();
const auth = require("../../middlewares/auth");

// Define routes and link them to corresponding controller functions using 'ctrlWrapper'.

// Route: GET '/api/contacts/'
// Description: This route is used to retrieve all contacts.
// Controller Function: 'getAllContacts' from the 'contacts' controller module.
// Middleware: 'ctrlWrapper' will handle any errors that may occur during the controller function execution.
router.get("/", ctrlWrapper(ctrl.getAllContacts));


router.get("/:contactId", auth, ctrlWrapper(ctrl.getContactById));

// Route: POST '/api/contacts/'
// Description: This route is used to add a new contact.
// Controller Function: 'addContact' from the 'contacts' controller module.
// Middleware: 'ctrlWrapper' will handle any errors that may occur during the controller function execution.
router.post("/", auth, validation(joiSchema), ctrlWrapper(ctrl.addContact));

router.delete("/:contactId", auth, ctrlWrapper(ctrl.removeContact));

router.put("/:contactId", auth, ctrlWrapper(ctrl.updateContact));

router.patch("/:contactId", auth, ctrlWrapper(ctrl.updateStatusContact));

// Export the router to be used in 'app.js'.
module.exports = router;

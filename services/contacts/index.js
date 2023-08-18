// Import the 'getAllContacts' and 'addContact' service functions from their respective files.
const getAllContacts = require("./getAllContacts");
const addContact = require("./addContact");
const getContactById = require("./getContactById");
const removeContact = require("./removeContact");
const updateContact = require("./updateContact");
// Export an object containing the imported service functions.
module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

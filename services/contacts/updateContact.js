const { Contact } = require("../../models");

// Service function for adding a new contact.
const updateContact = async (contactId, body) => {
  try {
    // Call the 'updateContact' function from 'contactsOperations' to update existing contact.
    const data = await Contact.findOneAndUpdate(contactId, body);
    // Return the data (the newly added contact) to the caller.
    return data;
  } catch (err) {
    // If an error occurs during the operation, log the error message to the console.
    console.log(err.message);
  }
};

// Export the 'updateContact' service function to be used in 'controllers/contacts/updateContact.js'.
module.exports = updateContact;




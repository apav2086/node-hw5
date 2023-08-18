const { Contact } = require("../../models");

const updateStatusContact = async (contactId, body) => {
  try {
   
    const data = await Contact.findOneAndUpdate(contactId, body);
    
    return data;
  } catch (err) {
    // If an error occurs during the operation, log the error message to the console.
    console.log(err.message);
  }
};

// Export the 'updateContact' service function to be used in 'controllers/contacts/updateContact.js'.
module.exports = updateStatusContact;
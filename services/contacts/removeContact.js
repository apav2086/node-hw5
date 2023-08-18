const { Contact } = require("../../models");


const removeContact = async (contactId) => {
  try {
    
    const data = await Contact.findOneAndDelete(contactId);
   
    return data;
  } catch (error) {
    
    console.log(error.message);
  }
};


module.exports = removeContact;




















const { Contact } = require("../../models");


const getContactById = async (contactId) => {
  try {
    
    const data = await Contact.findOne(contactId);
   
    return data;
  } catch (error) {
    
    console.log(error.message);
  }
};


module.exports = getContactById;
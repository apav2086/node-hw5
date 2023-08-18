const createError = require("http-errors");
const { contacts: service } = require("../../services");


const removeContact = async (req, res) => {
 const { contactId } = req.params;
  const result = await service.removeContact(contactId);
    if (!result) {
    throw createError(404, "not found");
  }
    res.status(200).json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

// Export the 'getContactById' function to be used in 'routes/api/contacts.js'.
module.exports = removeContact;

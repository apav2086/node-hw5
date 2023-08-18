const createError = require("http-errors");
const { contacts: service } = require("../../services");


const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await service.getContactById(contactId);

  if (!result) {
    throw createError(404, `Not found`);
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
module.exports = getContactById;



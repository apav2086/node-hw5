const createError = require("http-errors");
const { contactSchema } = require("../../models");
const { contacts: service } = require("../../services");


const updateContact = async (req, res) => {
 
  const { error } = contactSchema.validate(req.body);

 
  if (error) {
    throw createError(404, "missing fields");
  }
  const { contactId } = req.params;
  const result = await service.updateContact(contactId, req.body);
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

module.exports = updateContact;



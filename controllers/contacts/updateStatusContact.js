const createError = require("http-errors");
const { contactSchema } = require("../../models");
const { contacts: service } = require("../../services");


const updateStatusContact = async (req, res) => {
 
  const { error } = contactSchema.validate(req.body);

 
  if (error) {
    throw createError(400, "missing field favorite");
  }
  const { contactId } = req.params;
  const result = await service.updataStatusContact(contactId, req.body);
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

module.exports = updateStatusContact;
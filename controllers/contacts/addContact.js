// Import the 'contact' service module from the '../../service' directory
const { contact: service } = require("../../services");

// Controller function to handle the addition of a new contact
const addContact = async (req, res) => {
  // Call the 'addContact' function from the 'contact' service module, passing the request body data
  const result = await service.addContact(req.body);

  // Respond to the client with a successful response, indicating the contact has been added
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      result,
    },
  });
};

// Export the 'addContact' controller function to be used in other parts of the application
module.exports = addContact;

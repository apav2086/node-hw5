// Import the 'contact' service module from the '../../service' directory
const { contact: service } = require("../../services");

// Controller function to handle retrieving all contacts
const getAllContacts = async (req, res) => {
  // Call the 'getAllContacts' function from the 'contact' service module
  const result = await service.getAllContacts();

  // Respond to the client with a successful response, including the retrieved contacts data
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

// Export the 'getAllContacts' controller function to be used in other parts of the application
module.exports = getAllContacts;

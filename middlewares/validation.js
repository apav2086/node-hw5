// Middleware function for request data validation
const validation = (schema) => {
  // Return an inner function that will be used as the actual middleware
  return (req, res, next) => {
    // Validate the request body against the provided 'schema'
    const { error } = schema.validate(req.body);

    // If there is an error in the validation result, set the status code to 400 (Bad Request)
    // and pass the error to the next middleware/handler for error handling
    if (error) {
      error.status = 400;
      return next(error);
    }

    // If the validation is successful, continue to the next middleware/handler in the chain
    next();
  };
};

// Export the 'validation' middleware function to be used in other parts of the application
module.exports = validation;

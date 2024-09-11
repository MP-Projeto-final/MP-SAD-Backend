/**
 * Middleware function to validate the request body against a provided schema.
 * 
 * This middleware uses Joi schema validation to ensure that the request body conforms
 * to the expected format. If validation fails, it returns a 422 Unprocessable Entity
 * status with a list of validation error messages.
 * 
 * @param {Object} schema - The Joi schema object used to validate the request body.
 * @returns {Function} - Returns an Express middleware function that validates the request body.
 */
export function schemaValidation(schema) {
    return (req, res, next) => {
        // Validate the request body against the provided schema, allowing multiple errors.
        const validation = schema.validate(req.body, { abortEarly: false });

        // If validation fails, map the error details to an array of error messages.
        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            // Respond with a 422 status code and the array of error messages.
            return res.status(422).send(errors);
        }

        // If validation passes, proceed to the next middleware or route handler.
        next();
    }
}

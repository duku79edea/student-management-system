const Joi = require('joi');

const studentValidatorSchema = Joi.object({
    studentId: Joi.string().trim().max(50).required().messages({
        "string.empty": "Student ID cannot be empty or whitespaces only",
        "any.required": "Student ID is required",
        "string.max": "Student ID cannot exceed 50 characters"
    }),
    firstName: Joi.string().trim().min(1).max(100).required().messages({
        "string.empty": "First name cannot be empty or whitespaces only",
        "any.required": "First name is required",
        "string.max": "First name cannot exceed 50 characters"
    }),
    lastName: Joi.string().trim().min(1).max(100).required().messages({
        "string.empty": "Last name cannot be empty or whitespaces only",
        "any.required": "Last name is required",
        "string.max": "Last name cannot exceed 50 characters"
    }),
    email: Joi.string().trim().lowercase().email().max(255).required().messages({
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.max": "Email cannot exceed 255 characters"
    }),
    dateOfBirth: Joi.date().iso().raw().max("now").required().messages({
        "any.required": "Date of birth is required",
        "date.base": "Please enter a valid date of birth",
        "date.format": "The format must be DD-MM-YYYY",
        "date.max": "The date of birth cannot be a future date"
    }),
    contactNumber: Joi.string().trim().required().messages({
        "string.empty": "Contact number cannot be empty or whitespaces only",
        "any.required": "Contact number is required",
        "string.max": "Contact number cannot exceed 50 characters"
    }),
    enrollmentDate: Joi.date().iso().required().messages({
        "any.required": "Enrollment date is required",
        "date.base": "Please enter a valid enrollment date",
        "date.format": "The format must be DD-MM-YYYY",
    }),
    status: Joi.string().valid("Active", "Inactive", "Graduated").default("Active"),
    profilePicture: Joi.string().uri().allow(null, "")

});

module.exports = { studentValidatorSchema };
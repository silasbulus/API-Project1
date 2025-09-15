const Joi = require("joi");

const accountvalidate = Joi.object({
  firstname: Joi.string().required().messages({
    "string.empty": "First Name is required",
  }),
  lastname: Joi.string().required().messages({
    "string.empty": "Last Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
const loginvalidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
const passwordvalidate = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  newpassword: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "New Password is required",
      "string.min": "New Password must be at least 8 characters long",
      "string.pattern.base":
        "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

const validateaddress = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
});

const validateProduct = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  prescription: Joi.string().required().messages({
    "string.empty": "prescription must be a number",
    "any.required": "prescription required",
  }),
  shortdescription: Joi.string().required().messages({
    "string.empty": "Short Description is required",
    "any.required": "Short Description is required",
  }),
  longdescription: Joi.string().required().messages({
    "string.empty": "Long Description is required",
    "any.required": "Long Description is required",
  }),
  stock: Joi.number().required().messages({
    "number.base": "Stock must be a number",
    "any.required": "Stock is required",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),

  lowStockThreshold: Joi.number().default(10),

  expiryDate: Joi.date().required().messages({
    "date.base": "Expiry date must be a valid date",
    "any.required": "Expiry date is required",
  }),
});
module.exports = {
  accountvalidate,
  loginvalidate,
  passwordvalidate,
  validateaddress,
  validateProduct,
};

const Joi = require("joi");

const schemas = {
  driver: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Driver name is required",
      "string.min": "Driver name must be at least 2 characters long",
      "string.max": "Driver name cannot exceed 50 characters",
    }),
    currentShiftHours: Joi.number().min(0).max(24).default(0).messages({
      "number.min": "Current shift hours cannot be negative",
      "number.max": "Current shift hours cannot exceed 24",
    }),
    past7DayWorkHours: Joi.number().min(0).default(0).messages({
      "number.min": "Past 7-day work hours cannot be negative",
    }),
    isActive: Joi.boolean().default(true),
    overtimeHours: Joi.number().min(0).default(0),
    lastWorkDate: Joi.date().default(Date.now),
  }),

  route: Joi.object({
    routeId: Joi.string().trim().required().messages({
      "string.empty": "Route ID is required",
    }),
    startLocation: Joi.string().trim().required().messages({
      "string.empty": "Start location is required",
    }),
    endLocation: Joi.string().trim().required().messages({
      "string.empty": "End location is required",
    }),
    distanceKm: Joi.number().min(0).required().messages({
      "number.min": "Distance cannot be negative",
      "any.required": "Distance is required",
    }),
    trafficLevel: Joi.string()
      .valid("Low", "Medium", "High")
      .required()
      .messages({
        "any.only": "Traffic level must be Low, Medium, or High",
        "any.required": "Traffic level is required",
      }),
    baseTimeMinutes: Joi.number().min(1).required().messages({
      "number.min": "Base time must be at least 1 minute",
      "any.required": "Base time is required",
    }),
    isActive: Joi.boolean().default(true),
  }),

  order: Joi.object({
    orderId: Joi.string().trim().required().messages({
      "string.empty": "Order ID is required",
    }),
    valueRs: Joi.number().min(0).required().messages({
      "number.min": "Order value cannot be negative",
      "any.required": "Order value is required",
    }),
    assignedRoute: Joi.string().required().messages({
      "any.required": "Assigned route is required",
    }),
    deliveryTimestamp: Joi.date().optional(),
  }),

  simulation: Joi.object({
    availableDrivers: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .required()
      .messages({
        "number.min": "At least 1 driver is required",
        "number.max": "Cannot exceed 100 drivers",
        "any.required": "Number of available drivers is required",
      }),
    routeStartTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base":
          "Route start time must be in HH:MM format (24-hour)",
        "any.required": "Route start time is required",
      }),
    maxHoursPerDay: Joi.number().min(1).max(24).required().messages({
      "number.min": "Max hours per day must be at least 1",
      "number.max": "Max hours per day cannot exceed 24",
      "any.required": "Max hours per day is required",
    }),
  }),

  login: Joi.object({
    username: Joi.string().trim().required().messages({
      "string.empty": "Username or email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  register: Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    role: Joi.string().valid("manager", "admin").default("manager"),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details[0].message,
        field: error.details[0].path[0],
      });
    }
    next();
  };
};

module.exports = { validate, schemas };

const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startLocation: {
      type: String,
      required: true,
      trim: true,
    },
    endLocation: {
      type: String,
      required: true,
      trim: true,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },
    trafficLevel: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    baseTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for traffic multiplier
routeSchema.virtual("trafficMultiplier").get(function () {
  switch (this.trafficLevel) {
    case "High":
      return 1.5;
    case "Medium":
      return 1.2;
    case "Low":
      return 1.0;
    default:
      return 1.0;
  }
});

// Virtual field for fuel surcharge per km
routeSchema.virtual("fuelSurcharge").get(function () {
  return this.trafficLevel === "High" ? 2 : 0; // ₹2/km for high traffic
});

module.exports = mongoose.model("Route", routeSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    valueRs: {
      type: Number,
      required: true,
      min: 0,
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    deliveryTimestamp: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "delivered", "late"],
      default: "pending",
    },
    actualDeliveryTimeMinutes: {
      type: Number,
    },
    isOnTime: {
      type: Boolean,
    },
    profit: {
      type: Number,
      default: 0,
    },
    fuelCost: {
      type: Number,
      default: 0,
    },
    baseFuelCost: {
      type: Number,
      default: 0,
    },
    trafficSurcharge: {
      type: Number,
      default: 0,
    },
    penalty: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    expectedDeliveryTime: {
      type: Number, // in minutes
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for profit margin
orderSchema.virtual("profitMargin").get(function () {
  if (this.valueRs === 0) return 0;
  return ((this.profit / this.valueRs) * 100).toFixed(2);
});

// Virtual field for delivery status
orderSchema.virtual("deliveryStatus").get(function () {
  if (this.status === "late") return "Late";
  if (this.isOnTime === true) return "On Time";
  if (this.status === "delivered") return "Delivered";
  return "Pending";
});

module.exports = mongoose.model("Order", orderSchema);

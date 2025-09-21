const mongoose = require("mongoose");

const simulationResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inputParameters: {
      availableDrivers: Number,
      routeStartTime: String,
      maxHoursPerDay: Number,
    },
    kpis: {
      totalProfit: Number,
      efficiencyScore: Number,
      onTimeDeliveries: Number,
      lateDeliveries: Number,
      totalDeliveries: Number,
      totalFuelCost: Number,
      baseFuelCost: Number,
      trafficSurcharge: Number,
    },
    ordersProcessed: Number,
    driversUsed: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SimulationResult", simulationResultSchema);

const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    currentShiftHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24,
    },
    past7DayWorkHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFatigued: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastWorkDate: {
      type: Date,
      default: Date.now,
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate fatigue based on work hours (Company Rule 2)
driverSchema.methods.updateFatigueStatus = function () {
  this.isFatigued = this.currentShiftHours > 8;
  this.overtimeHours = Math.max(0, this.currentShiftHours - 8);
};

// Calculate speed reduction due to fatigue (Company Rule 2)
driverSchema.methods.getFatigueSpeedReduction = function () {
  if (this.isFatigued || this.currentShiftHours > 8) {
    return 0.3; // 30% speed reduction
  }
  return 0;
};

// Virtual field for status
driverSchema.virtual("status").get(function () {
  if (!this.isActive) return "Inactive";
  if (this.isFatigued) return "Fatigued";
  if (this.currentShiftHours > 8) return "Overtime";
  return "Active";
});

// Virtual field for efficiency rating
driverSchema.virtual("efficiencyRating").get(function () {
  if (this.currentShiftHours > 8) return "Reduced";
  if (this.currentShiftHours >= 6) return "Normal";
  return "High";
});

module.exports = mongoose.model("Driver", driverSchema);

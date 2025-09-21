const express = require("express");
const SimulationService = require("../services/SimulationService");
const SimulationResult = require("../Models/simulationResultSchema");
const auth = require("../Middleware/auth");
const { validate } = require("../utils/validation");

const router = express.Router();

router.use(auth);

// Run simulation
router.post("/run", validate("simulation"), async (req, res) => {
  try {
    const { availableDrivers, routeStartTime, maxHoursPerDay } = req.body;

    // Additional business validation
    if (availableDrivers > 100) {
      return res.status(400).json({
        error: "Available drivers cannot exceed 100",
      });
    }

    // Run simulation
    const result = await SimulationService.runSimulation({
      availableDrivers,
      routeStartTime,
      maxHoursPerDay,
    });

    // Save simulation result
    const simulationResult = new SimulationResult({
      userId: req.user._id,
      inputParameters: {
        availableDrivers,
        routeStartTime,
        maxHoursPerDay,
      },
      kpis: result.kpis,
      ordersProcessed: result.simulationData.ordersProcessed,
      driversUsed: result.simulationData.driversUsed,
    });

    await simulationResult.save();

    res.json({
      ...result,
      simulationId: simulationResult._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get simulation history
router.get("/history", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const simulations = await SimulationResult.find({ userId: req.user._id })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await SimulationResult.countDocuments({
      userId: req.user._id,
    });

    res.json({
      simulations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific simulation result
router.get("/:id", async (req, res) => {
  try {
    const simulation = await SimulationResult.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

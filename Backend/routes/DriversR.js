const express = require("express");
const Driver = require("../Models/driverschema");
const auth = require("../Middleware/auth");
const { validate } = require("../utils/validation");

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET all drivers
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const drivers = await Driver.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Update fatigue status for each driver
    drivers.forEach((driver) => {
      driver.updateFatigueStatus();
    });

    const total = await Driver.countDocuments(query);

    // Calculate statistics
    const stats = {
      total: total,
      active: drivers.filter((d) => d.isActive && !d.isFatigued).length,
      fatigued: drivers.filter((d) => d.isFatigued).length,
      inactive: drivers.filter((d) => !d.isActive).length,
      overtime: drivers.filter((d) => d.currentShiftHours > 8).length,
    };

    res.json({
      drivers,
      stats,
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

// GET single driver
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE driver
router.post("/", validate("driver"), async (req, res) => {
  try {
    const driver = new Driver(req.body);
    driver.updateFatigueStatus();
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Driver with this name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE driver
router.put("/:id", validate("driver"), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    driver.updateFatigueStatus();
    await driver.save();

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE driver
router.delete("/:id", async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

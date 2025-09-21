const express = require("express");
const Route = require("../Models/routtesschema");
const auth = require("../Middleware/auth");
const { validate } = require("../utils/validation");

const router = express.Router();

router.use(auth);

// GET all routes
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", trafficLevel = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.routeId = { $regex: search, $options: "i" };
    }
    if (trafficLevel) {
      query.trafficLevel = trafficLevel;
    }

    const routes = await Route.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Route.countDocuments(query);

    res.json({
      routes,
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

// GET single route
router.get("/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE route
router.post("/", validate("route"), async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Route ID already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE route
router.put("/:id", validate("route"), async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

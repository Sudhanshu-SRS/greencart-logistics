const express = require("express");
const Order = require("../Models/orderSchema");
const Route = require("../Models/routtesschema");
const auth = require("../Middleware/auth");
const { validate } = require("../utils/validation");

const router = express.Router();

router.use(auth);

// GET all orders
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "", search = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.orderId = { $regex: search, $options: "i" };
    }

    const orders = await Order.find(query)
      .populate(
        "assignedRoute",
        "routeId distanceKm trafficLevel baseTimeMinutes"
      )
      .populate("assignedDriver", "name currentShiftHours isFatigued")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
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

// GET single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("assignedRoute")
      .populate("assignedDriver");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE order
router.post("/", validate("order"), async (req, res) => {
  try {
    // Verify that the assigned route exists
    const route = await Route.findById(req.body.assignedRoute);
    if (!route) {
      return res.status(400).json({ error: "Assigned route does not exist" });
    }

    const order = new Order(req.body);
    await order.save();

    // Populate the response
    await order.populate("assignedRoute");

    res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Order ID already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE order
router.put("/:id", validate("order"), async (req, res) => {
  try {
    // Verify that the assigned route exists
    if (req.body.assignedRoute) {
      const route = await Route.findById(req.body.assignedRoute);
      if (!route) {
        return res.status(400).json({ error: "Assigned route does not exist" });
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedRoute")
      .populate("assignedDriver");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

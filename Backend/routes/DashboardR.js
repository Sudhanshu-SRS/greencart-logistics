const express = require("express");
const Order = require("../Models/orderSchema");
const Driver = require("../Models/driverschema");
const Route = require("../Models/routtesschema");
const SimulationResult = require("../Models/simulationResultSchema");
const auth = require("../Middleware/auth");

const router = express.Router();

router.use(auth);

// Get dashboard KPIs with Company Rules
router.get("/kpis", async (req, res) => {
  try {
    // Get latest simulation or calculate from current data
    const latestSimulation = await SimulationResult.findOne({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    if (latestSimulation) {
      return res.json(latestSimulation.kpis);
    }

    // If no simulation exists, calculate basic KPIs from current data
    const orders = await Order.find().populate("assignedRoute");
    const drivers = await Driver.find();
    const routes = await Route.find();

    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let totalDeliveries = orders.length;
    let totalFuelCost = 0;
    let totalPenalties = 0;
    let totalBonuses = 0;

    orders.forEach((order) => {
      // Apply company rules to existing orders
      if (order.profit !== undefined) {
        totalProfit += order.profit;
      } else {
        // Calculate profit using company rules if not already calculated
        let orderProfit = order.valueRs || 0;

        // Company Rule 4: Fuel Cost
        const route = order.assignedRoute;
        if (route) {
          const fuelCost =
            route.distanceKm * 5 +
            (route.trafficLevel === "High" ? route.distanceKm * 2 : 0);
          orderProfit -= fuelCost;
          totalFuelCost += fuelCost;
        }

        // Company Rule 1: Late delivery penalty
        if (order.status === "late") {
          orderProfit -= 50;
          totalPenalties += 50;
        }

        // Company Rule 3: High-value bonus
        if (order.valueRs > 1000 && order.isOnTime) {
          const bonus = order.valueRs * 0.1;
          orderProfit += bonus;
          totalBonuses += bonus;
        }

        totalProfit += orderProfit;
      }

      if (order.fuelCost !== undefined) {
        totalFuelCost += order.fuelCost;
      }
      if (order.isOnTime === true) {
        onTimeDeliveries++;
      }
    });

    // Company Rule 6: Efficiency Score
    const efficiencyScore =
      totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

    const kpis = {
      totalProfit: Math.round(totalProfit * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      onTimeDeliveries,
      lateDeliveries: totalDeliveries - onTimeDeliveries,
      totalDeliveries,
      totalFuelCost: Math.round(totalFuelCost * 100) / 100,
      baseFuelCost: Math.round(totalFuelCost * 100) / 100,
      trafficSurcharge: 0,
      totalPenalties: Math.round(totalPenalties * 100) / 100,
      totalBonuses: Math.round(totalBonuses * 100) / 100,
    };

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ isActive: true });
    const fatiguedDrivers = await Driver.countDocuments({ isFatigued: true });
    const overtimeDrivers = await Driver.countDocuments({
      currentShiftHours: { $gt: 8 },
    });

    const totalRoutes = await Route.countDocuments();
    const highTrafficRoutes = await Route.countDocuments({
      trafficLevel: "High",
    });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const lateOrders = await Order.countDocuments({ status: "late" });
    const onTimeOrders = await Order.countDocuments({ isOnTime: true });

    res.json({
      drivers: {
        total: totalDrivers,
        active: activeDrivers,
        inactive: totalDrivers - activeDrivers,
        fatigued: fatiguedDrivers,
        overtime: overtimeDrivers,
      },
      routes: {
        total: totalRoutes,
        highTraffic: highTrafficRoutes,
        active: await Route.countDocuments({ isActive: true }),
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: totalOrders - pendingOrders,
        late: lateOrders,
        onTime: onTimeOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

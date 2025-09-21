const mongoose = require("mongoose");
const Driver = require("../Models/driverschema");
const Route = require("../Models/routtesschema");
const Order = require("../Models/orderSchema");

async function verifyData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/logistics"
    );
    console.log("Connected to MongoDB successfully!");

    // Check drivers
    const drivers = await Driver.find();
    console.log("\n=== DRIVERS ===");
    console.log(`Total drivers: ${drivers.length}`);
    drivers.forEach((driver) => {
      console.log(
        `- ${driver.name}: ${driver.currentShiftHours}h current, ${driver.past7DayWorkHours}h past week (${driver.fatigueStatus})`
      );
    });

    // Check routes
    const routes = await Route.find();
    console.log("\n=== ROUTES ===");
    console.log(`Total routes: ${routes.length}`);
    routes.forEach((route) => {
      console.log(
        `- ${route.routeId}: ${route.startLocation} → ${route.endLocation} (${route.distanceKm}km, ${route.trafficLevel} traffic)`
      );
    });

    // Check orders
    const orders = await Order.find().populate("assignedRoute");
    console.log("\n=== ORDERS ===");
    console.log(`Total orders: ${orders.length}`);

    // Group orders by route
    const ordersByRoute = {};
    orders.forEach((order) => {
      const routeId = order.assignedRoute.routeId;
      if (!ordersByRoute[routeId]) {
        ordersByRoute[routeId] = [];
      }
      ordersByRoute[routeId].push(order);
    });

    Object.keys(ordersByRoute).forEach((routeId) => {
      const routeOrders = ordersByRoute[routeId];
      const totalValue = routeOrders.reduce(
        (sum, order) => sum + order.valueRs,
        0
      );
      console.log(
        `- ${routeId}: ${routeOrders.length} orders, ₹${totalValue} total value`
      );
    });

    console.log("\n✅ Database verification completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database verification failed:", error.message);
    process.exit(1);
  }
}

verifyData();

const Driver = require("../Models/driverschema");
const Route = require("../Models/routtesschema");
const Order = require("../Models/orderSchema");

class SimulationService {
  static async runSimulation(simulationData) {
    const { availableDrivers, routeStartTime, maxHoursPerDay } = simulationData;

    // Get available drivers and routes
    const drivers = await Driver.find({ isActive: true }).limit(
      availableDrivers
    );
    const routes = await Route.find({ isActive: true });
    const orders = await Order.find({ status: "pending" }).populate(
      "assignedRoute"
    );

    if (drivers.length === 0) {
      throw new Error("No available drivers found");
    }

    if (routes.length === 0) {
      throw new Error("No available routes found");
    }

    if (orders.length === 0) {
      throw new Error("No pending orders found to process");
    }

    // Validate that we don't exceed available drivers
    if (availableDrivers > drivers.length) {
      throw new Error(
        `Only ${drivers.length} drivers available, but ${availableDrivers} requested`
      );
    }

    // Update driver fatigue status
    drivers.forEach((driver) => {
      driver.updateFatigueStatus();
    });

    // Reallocate orders to drivers (simple round-robin)
    const updatedOrders = [];
    orders.forEach((order, index) => {
      const driverIndex = index % drivers.length;
      order.assignedDriver = drivers[driverIndex]._id;
      updatedOrders.push(order);
    });

    // Calculate KPIs based on company rules
    const kpis = this.calculateKPIs(
      updatedOrders,
      drivers,
      routes,
      simulationData
    );

    return {
      kpis,
      simulationData: {
        driversUsed: drivers.length,
        ordersProcessed: orders.length,
        routesUsed: routes.length,
        timestamp: new Date(),
        inputParameters: simulationData,
      },
    };
  }

  static calculateKPIs(orders, drivers, routes, simulationParams) {
    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let totalFuelCost = 0;
    let baseFuelCost = 0;
    let trafficSurcharge = 0;
    let totalPenalties = 0;
    let totalBonuses = 0;

    orders.forEach((order) => {
      const route =
        routes.find(
          (r) => r._id.toString() === order.assignedRoute._id.toString()
        ) || order.assignedRoute;
      const driver = drivers.find(
        (d) => d._id.toString() === order.assignedDriver.toString()
      );

      if (!route || !driver) return;

      // COMPANY RULE 4: Fuel Cost Calculation
      const routeBaseFuelCost = route.distanceKm * 5; // ₹5/km base cost
      const routeTrafficSurcharge =
        route.trafficLevel === "High" ? route.distanceKm * 2 : 0; // +₹2/km for high traffic
      const orderFuelCost = routeBaseFuelCost + routeTrafficSurcharge;

      baseFuelCost += routeBaseFuelCost;
      trafficSurcharge += routeTrafficSurcharge;
      totalFuelCost += orderFuelCost;

      // COMPANY RULE 2: Driver Fatigue Rule
      // Calculate delivery time with fatigue factor
      let deliveryTime = route.baseTimeMinutes;
      let fatigueReduction = driver.getFatigueSpeedReduction();

      if (fatigueReduction > 0) {
        deliveryTime *= 1 + fatigueReduction; // 30% slower if fatigued
      }

      // COMPANY RULE 1: Late Delivery Penalty
      // Check if delivery is on time (late if delivery time > base route time + 10 minutes)
      const expectedDeliveryTime = route.baseTimeMinutes + 10;
      const isOnTime = deliveryTime <= expectedDeliveryTime;

      if (isOnTime) {
        onTimeDeliveries++;
      } else {
        lateDeliveries++;
      }

      // COMPANY RULE 5: Overall Profit Calculation
      let orderProfit = order.valueRs;
      let orderPenalty = 0;
      let orderBonus = 0;

      // Apply late delivery penalty (Company Rule 1)
      if (!isOnTime) {
        orderPenalty = 50; // ₹50 penalty for late delivery
        orderProfit -= orderPenalty;
        totalPenalties += orderPenalty;
      }

      // COMPANY RULE 3: High-Value Bonus
      // Apply high-value bonus if order value > ₹1000 AND delivered on time
      if (order.valueRs > 1000 && isOnTime) {
        orderBonus = order.valueRs * 0.1; // 10% bonus for high value on-time delivery
        orderProfit += orderBonus;
        totalBonuses += orderBonus;
      }

      // Subtract fuel cost from profit
      orderProfit -= orderFuelCost;

      totalProfit += orderProfit;

      // Update order properties for tracking
      order.isOnTime = isOnTime;
      order.actualDeliveryTimeMinutes = Math.round(deliveryTime);
      order.expectedDeliveryTime = expectedDeliveryTime;
      order.profit = Math.round(orderProfit * 100) / 100;
      order.fuelCost = Math.round(orderFuelCost * 100) / 100;
      order.baseFuelCost = Math.round(routeBaseFuelCost * 100) / 100;
      order.trafficSurcharge = Math.round(routeTrafficSurcharge * 100) / 100;
      order.penalty = orderPenalty;
      order.bonus = Math.round(orderBonus * 100) / 100;
      order.status = isOnTime ? "delivered" : "late";
    });

    const totalDeliveries = orders.length;

    // COMPANY RULE 6: Efficiency Score
    const efficiencyScore =
      totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

    return {
      totalProfit: Math.round(totalProfit * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      onTimeDeliveries,
      lateDeliveries,
      totalDeliveries,
      totalFuelCost: Math.round(totalFuelCost * 100) / 100,
      baseFuelCost: Math.round(baseFuelCost * 100) / 100,
      trafficSurcharge: Math.round(trafficSurcharge * 100) / 100,
      totalPenalties: Math.round(totalPenalties * 100) / 100,
      totalBonuses: Math.round(totalBonuses * 100) / 100,
      averageDeliveryTime:
        Math.round(
          (orders.reduce(
            (sum, order) => sum + (order.actualDeliveryTimeMinutes || 0),
            0
          ) /
            totalDeliveries) *
            100
        ) / 100,
      fuelEfficiency: Math.round((totalDeliveries / totalFuelCost) * 100) / 100, // deliveries per rupee
    };
  }
}

module.exports = SimulationService;

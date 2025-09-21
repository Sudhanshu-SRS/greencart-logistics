const mongoose = require("mongoose");
const Driver = require("../Models/driverschema");
const Route = require("../Models/routtesschema");
const Order = require("../Models/orderSchema");
const User = require("../Models/User");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@greencart.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();

    // Create manager user
    const managerUser = new User({
      username: "manager",
      email: "manager@greencart.com",
      password: "manager123",
      role: "manager",
    });
    await managerUser.save();

    // Create sample drivers
    const drivers = [
      { name: "Rajesh Kumar", currentShiftHours: 6, past7DayWorkHours: 42 },
      { name: "Amit Singh", currentShiftHours: 9, past7DayWorkHours: 56 },
      { name: "Priya Sharma", currentShiftHours: 4, past7DayWorkHours: 35 },
      { name: "Mohammed Ali", currentShiftHours: 7, past7DayWorkHours: 48 },
      { name: "Suresh Patel", currentShiftHours: 10, past7DayWorkHours: 60 },
    ];

    const createdDrivers = await Driver.insertMany(
      drivers.map((driver) => {
        const d = new Driver(driver);
        d.updateFatigueStatus();
        return d;
      })
    );

    // Create sample routes
    const routes = [
      {
        routeId: "RT001",
        startLocation: "Mumbai Central",
        endLocation: "Andheri West",
        distanceKm: 12.5,
        trafficLevel: "Low",
        baseTimeMinutes: 45,
      },
      {
        routeId: "RT002",
        startLocation: "Bandra",
        endLocation: "Powai",
        distanceKm: 8.3,
        trafficLevel: "Medium",
        baseTimeMinutes: 35,
      },
      {
        routeId: "RT003",
        startLocation: "Thane",
        endLocation: "Navi Mumbai",
        distanceKm: 15.7,
        trafficLevel: "High",
        baseTimeMinutes: 60,
      },
      {
        routeId: "RT004",
        startLocation: "Colaba",
        endLocation: "Marine Drive",
        distanceKm: 6.2,
        trafficLevel: "Low",
        baseTimeMinutes: 25,
      },
      {
        routeId: "RT005",
        startLocation: "Borivali",
        endLocation: "Kandivali",
        distanceKm: 20.1,
        trafficLevel: "High",
        baseTimeMinutes: 75,
      },
      {
        routeId: "RT006",
        startLocation: "Dadar",
        endLocation: "Lower Parel",
        distanceKm: 11.4,
        trafficLevel: "Medium",
        baseTimeMinutes: 40,
      },
      {
        routeId: "RT007",
        startLocation: "Worli",
        endLocation: "BKC",
        distanceKm: 9.8,
        trafficLevel: "Low",
        baseTimeMinutes: 32,
      },
      {
        routeId: "RT008",
        startLocation: "Goregaon",
        endLocation: "Malad",
        distanceKm: 18.3,
        trafficLevel: "High",
        baseTimeMinutes: 68,
      },
    ];

    const createdRoutes = await Route.insertMany(routes);

    // Create sample orders
    const orders = [
      { orderId: "ORD001", valueRs: 1200, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD002", valueRs: 850, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD003", valueRs: 1500, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD004", valueRs: 750, assignedRoute: createdRoutes[3]._id },
      { orderId: "ORD005", valueRs: 2000, assignedRoute: createdRoutes[4]._id },
      { orderId: "ORD006", valueRs: 950, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD007", valueRs: 1100, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD008", valueRs: 650, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD009", valueRs: 1800, assignedRoute: createdRoutes[5]._id },
      { orderId: "ORD010", valueRs: 920, assignedRoute: createdRoutes[6]._id },
      { orderId: "ORD011", valueRs: 1350, assignedRoute: createdRoutes[7]._id },
      { orderId: "ORD012", valueRs: 780, assignedRoute: createdRoutes[3]._id },
    ];

    await Order.insertMany(orders);

    console.log("Sample data created successfully!");
    console.log("Credentials:");
    console.log("Admin: username=admin, password=admin123");
    console.log("Manager: username=manager, password=manager123");
    console.log(`Created ${createdDrivers.length} drivers`);
    console.log(`Created ${createdRoutes.length} routes`);
    console.log(`Created ${orders.length} orders`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

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

    // Create sample drivers based on Excel data
    const drivers = [
      {
        name: "Amit",
        currentShiftHours: 6,
        past7DayWorkHours: 6 + 8 + 7 + 7 + 7 + 6 + 10, // 51 hours
        isActive: true,
      },
      {
        name: "Priya",
        currentShiftHours: 6,
        past7DayWorkHours: 10 + 9 + 6 + 6 + 6 + 7 + 7, // 51 hours
        isActive: true,
      },
      {
        name: "Rohit",
        currentShiftHours: 10,
        past7DayWorkHours: 10 + 6 + 10 + 7 + 10 + 9 + 7, // 59 hours
        isActive: true,
      },
      {
        name: "Neha",
        currentShiftHours: 9,
        past7DayWorkHours: 10 + 8 + 6 + 7 + 9 + 8 + 8, // 56 hours
        isActive: true,
      },
      {
        name: "Karan",
        currentShiftHours: 7,
        past7DayWorkHours: 7 + 8 + 6 + 6 + 9 + 6 + 8, // 50 hours
        isActive: true,
      },
      {
        name: "Sneha",
        currentShiftHours: 8,
        past7DayWorkHours: 10 + 8 + 6 + 9 + 10 + 6 + 9, // 58 hours
        isActive: true,
      },
      {
        name: "Vikram",
        currentShiftHours: 6,
        past7DayWorkHours: 10 + 8 + 10 + 8 + 10 + 7 + 6, // 59 hours
        isActive: true,
      },
      {
        name: "Anjali",
        currentShiftHours: 6,
        past7DayWorkHours: 7 + 8 + 6 + 7 + 6 + 9 + 8, // 51 hours
        isActive: true,
      },
      {
        name: "Manoj",
        currentShiftHours: 9,
        past7DayWorkHours: 8 + 7 + 8 + 8 + 7 + 8 + 6, // 52 hours
        isActive: true,
      },
      {
        name: "Pooja",
        currentShiftHours: 10,
        past7DayWorkHours: 7 + 10 + 7 + 7 + 9 + 9 + 8, // 57 hours
        isActive: true,
      },
    ];

    const createdDrivers = await Driver.insertMany(
      drivers.map((driver) => {
        const d = new Driver(driver);
        d.updateFatigueStatus();
        return d;
      })
    );

    // Create sample routes based on Excel data
    const routes = [
      {
        routeId: "RT001",
        startLocation: "Mumbai Central",
        endLocation: "Andheri West",
        distanceKm: 15,
        trafficLevel: "Low",
        baseTimeMinutes: 30,
      },
      {
        routeId: "RT002",
        startLocation: "Bandra",
        endLocation: "Powai",
        distanceKm: 12,
        trafficLevel: "Medium",
        baseTimeMinutes: 45,
      },
      {
        routeId: "RT003",
        startLocation: "Thane",
        endLocation: "Navi Mumbai",
        distanceKm: 18,
        trafficLevel: "High",
        baseTimeMinutes: 60,
      },
      {
        routeId: "RT004",
        startLocation: "Colaba",
        endLocation: "Marine Drive",
        distanceKm: 8,
        trafficLevel: "Low",
        baseTimeMinutes: 20,
      },
      {
        routeId: "RT005",
        startLocation: "Borivali",
        endLocation: "Kandivali",
        distanceKm: 22,
        trafficLevel: "High",
        baseTimeMinutes: 75,
      },
      {
        routeId: "RT006",
        startLocation: "Dadar",
        endLocation: "Kurla",
        distanceKm: 10,
        trafficLevel: "Medium",
        baseTimeMinutes: 35,
      },
      {
        routeId: "RT007",
        startLocation: "Worli",
        endLocation: "Mahim",
        distanceKm: 6,
        trafficLevel: "Low",
        baseTimeMinutes: 15,
      },
      {
        routeId: "RT008",
        startLocation: "Vashi",
        endLocation: "Belapur",
        distanceKm: 14,
        trafficLevel: "Medium",
        baseTimeMinutes: 40,
      },
      {
        routeId: "RT009",
        startLocation: "Goregaon",
        endLocation: "Malad",
        distanceKm: 20,
        trafficLevel: "High",
        baseTimeMinutes: 70,
      },
      {
        routeId: "RT010",
        startLocation: "Chembur",
        endLocation: "Ghatkopar",
        distanceKm: 9,
        trafficLevel: "Medium",
        baseTimeMinutes: 25,
      },
    ];

    const createdRoutes = await Route.insertMany(routes);

    // Create sample orders based on Excel data (50 orders)
    const orders = [
      // Orders for RT001 (Mumbai Central -> Andheri West)
      { orderId: "ORD001", valueRs: 1500, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD002", valueRs: 2200, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD003", valueRs: 1800, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD004", valueRs: 3200, assignedRoute: createdRoutes[0]._id },
      { orderId: "ORD005", valueRs: 2800, assignedRoute: createdRoutes[0]._id },

      // Orders for RT002 (Bandra -> Powai)
      { orderId: "ORD006", valueRs: 1200, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD007", valueRs: 1900, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD008", valueRs: 2500, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD009", valueRs: 1600, assignedRoute: createdRoutes[1]._id },
      { orderId: "ORD010", valueRs: 3000, assignedRoute: createdRoutes[1]._id },

      // Orders for RT003 (Thane -> Navi Mumbai)
      { orderId: "ORD011", valueRs: 2100, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD012", valueRs: 1700, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD013", valueRs: 2900, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD014", valueRs: 2300, assignedRoute: createdRoutes[2]._id },
      { orderId: "ORD015", valueRs: 1400, assignedRoute: createdRoutes[2]._id },

      // Orders for RT004 (Colaba -> Marine Drive)
      { orderId: "ORD016", valueRs: 800, assignedRoute: createdRoutes[3]._id },
      { orderId: "ORD017", valueRs: 1100, assignedRoute: createdRoutes[3]._id },
      { orderId: "ORD018", valueRs: 950, assignedRoute: createdRoutes[3]._id },
      { orderId: "ORD019", valueRs: 1300, assignedRoute: createdRoutes[3]._id },
      { orderId: "ORD020", valueRs: 750, assignedRoute: createdRoutes[3]._id },

      // Orders for RT005 (Borivali -> Kandivali)
      { orderId: "ORD021", valueRs: 3500, assignedRoute: createdRoutes[4]._id },
      { orderId: "ORD022", valueRs: 4200, assignedRoute: createdRoutes[4]._id },
      { orderId: "ORD023", valueRs: 2800, assignedRoute: createdRoutes[4]._id },
      { orderId: "ORD024", valueRs: 3100, assignedRoute: createdRoutes[4]._id },
      { orderId: "ORD025", valueRs: 3800, assignedRoute: createdRoutes[4]._id },

      // Orders for RT006 (Dadar -> Kurla)
      { orderId: "ORD026", valueRs: 1350, assignedRoute: createdRoutes[5]._id },
      { orderId: "ORD027", valueRs: 1650, assignedRoute: createdRoutes[5]._id },
      { orderId: "ORD028", valueRs: 1200, assignedRoute: createdRoutes[5]._id },
      { orderId: "ORD029", valueRs: 1800, assignedRoute: createdRoutes[5]._id },
      { orderId: "ORD030", valueRs: 1450, assignedRoute: createdRoutes[5]._id },

      // Orders for RT007 (Worli -> Mahim)
      { orderId: "ORD031", valueRs: 650, assignedRoute: createdRoutes[6]._id },
      { orderId: "ORD032", valueRs: 820, assignedRoute: createdRoutes[6]._id },
      { orderId: "ORD033", valueRs: 750, assignedRoute: createdRoutes[6]._id },
      { orderId: "ORD034", valueRs: 900, assignedRoute: createdRoutes[6]._id },
      { orderId: "ORD035", valueRs: 700, assignedRoute: createdRoutes[6]._id },

      // Orders for RT008 (Vashi -> Belapur)
      { orderId: "ORD036", valueRs: 1950, assignedRoute: createdRoutes[7]._id },
      { orderId: "ORD037", valueRs: 2250, assignedRoute: createdRoutes[7]._id },
      { orderId: "ORD038", valueRs: 1750, assignedRoute: createdRoutes[7]._id },
      { orderId: "ORD039", valueRs: 2100, assignedRoute: createdRoutes[7]._id },
      { orderId: "ORD040", valueRs: 1850, assignedRoute: createdRoutes[7]._id },

      // Orders for RT009 (Goregaon -> Malad)
      { orderId: "ORD041", valueRs: 3300, assignedRoute: createdRoutes[8]._id },
      { orderId: "ORD042", valueRs: 2900, assignedRoute: createdRoutes[8]._id },
      { orderId: "ORD043", valueRs: 3700, assignedRoute: createdRoutes[8]._id },
      { orderId: "ORD044", valueRs: 3150, assignedRoute: createdRoutes[8]._id },
      { orderId: "ORD045", valueRs: 3450, assignedRoute: createdRoutes[8]._id },

      // Orders for RT010 (Chembur -> Ghatkopar)
      { orderId: "ORD046", valueRs: 1050, assignedRoute: createdRoutes[9]._id },
      { orderId: "ORD047", valueRs: 1250, assignedRoute: createdRoutes[9]._id },
      { orderId: "ORD048", valueRs: 950, assignedRoute: createdRoutes[9]._id },
      { orderId: "ORD049", valueRs: 1400, assignedRoute: createdRoutes[9]._id },
      { orderId: "ORD050", valueRs: 1150, assignedRoute: createdRoutes[9]._id },
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

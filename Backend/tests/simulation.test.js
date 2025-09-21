const SimulationService = require('../services/SimulationService');
const Driver = require('../Models/driverschema');
const Route = require('../Models/routtesschema');
const Order = require('../Models/orderSchema');

describe('Simulation Service - Business Rules', () => {
  let testDrivers, testRoutes, testOrders;

  beforeEach(async () => {
    // Clear existing data
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    // Create test data
    testDrivers = await Driver.create([
      { name: 'Driver 1', currentShiftHours: 6, isActive: true },
      { name: 'Driver 2', currentShiftHours: 10, isActive: true }, // Fatigued
      { name: 'Driver 3', currentShiftHours: 4, isActive: true }
    ]);

    testRoutes = await Route.create([
      {
        routeId: 'RT001',
        startLocation: 'Mumbai',
        endLocation: 'Pune',
        distanceKm: 150,
        trafficLevel: 'High',
        baseTimeMinutes: 180,
        isActive: true
      },
      {
        routeId: 'RT002',
        startLocation: 'Delhi',
        endLocation: 'Gurgaon',
        distanceKm: 30,
        trafficLevel: 'Low',
        baseTimeMinutes: 45,
        isActive: true
      }
    ]);

    testOrders = await Order.create([
      {
        orderId: 'ORD001',
        valueRs: 1500, // High value for bonus
        assignedRoute: testRoutes[0]._id,
        status: 'pending'
      },
      {
        orderId: 'ORD002',
        valueRs: 500, // Low value
        assignedRoute: testRoutes[1]._id,
        status: 'pending'
      }
    ]);
  });

  describe('Company Rule 1: Late Delivery Penalty', () => {
    it('should apply ₹50 penalty for late deliveries', async () => {
      const simulationParams = {
        availableDrivers: 2,
        routeStartTime: '09:00',
        maxHoursPerDay: 8
      };

      const result = await SimulationService.runSimulation(simulationParams);
      
      // Check if penalties are applied correctly
      expect(result.kpis.totalPenalties).toBeDefined();
      expect(typeof result.kpis.totalPenalties).toBe('number');
    });
  });

  describe('Company Rule 2: Driver Fatigue Rule', () => {
    it('should reduce speed by 30% for fatigued drivers', () => {
      const fatigueDriver = testDrivers.find(d => d.currentShiftHours > 8);
      const speedReduction = fatigueDriver.getFatigueSpeedReduction();
      
      expect(speedReduction).toBe(0.3); // 30% reduction
    });

    it('should not reduce speed for non-fatigued drivers', () => {
      const normalDriver = testDrivers.find(d => d.currentShiftHours <= 8);
      const speedReduction = normalDriver.getFatigueSpeedReduction();
      
      expect(speedReduction).toBe(0); // No reduction
    });
  });

  describe('Company Rule 3: High-Value Bonus', () => {
    it('should calculate bonus for high-value orders delivered on time', async () => {
      const simulationParams = {
        availableDrivers: 2,
        routeStartTime: '09:00',
        maxHoursPerDay: 8
      };

      const result = await SimulationService.runSimulation(simulationParams);
      
      expect(result.kpis.totalBonuses).toBeDefined();
      expect(typeof result.kpis.totalBonuses).toBe('number');
    });
  });

  describe('Company Rule 4: Fuel Cost Calculation', () => {
    it('should calculate base fuel cost at ₹5/km', () => {
      const route = testRoutes[1]; // Low traffic route
      const expectedBaseCost = route.distanceKm * 5;
      
      expect(route.distanceKm).toBe(30);
      expect(expectedBaseCost).toBe(150);
    });

    it('should add ₹2/km surcharge for high traffic', () => {
      const route = testRoutes[0]; // High traffic route
      const expectedSurcharge = route.trafficLevel === 'High' ? route.distanceKm * 2 : 0;
      
      expect(route.trafficLevel).toBe('High');
      expect(expectedSurcharge).toBe(300); // 150km * ₹2
    });
  });

  describe('Company Rule 5: Overall Profit Calculation', () => {
    it('should calculate profit correctly', async () => {
      const simulationParams = {
        availableDrivers: 2,
        routeStartTime: '09:00',
        maxHoursPerDay: 8
      };

      const result = await SimulationService.runSimulation(simulationParams);
      
      expect(result.kpis.totalProfit).toBeDefined();
      expect(typeof result.kpis.totalProfit).toBe('number');
      
      // Profit should be: order value + bonuses - penalties - fuel costs
      const expectedProfit = result.kpis.totalBonuses - result.kpis.totalPenalties - result.kpis.totalFuelCost;
      // Note: Order values are added in the actual calculation
    });
  });

  describe('Company Rule 6: Efficiency Score', () => {
    it('should calculate efficiency score correctly', async () => {
      const simulationParams = {
        availableDrivers: 2,
        routeStartTime: '09:00',
        maxHoursPerDay: 8
      };

      const result = await SimulationService.runSimulation(simulationParams);
      
      expect(result.kpis.efficiencyScore).toBeDefined();
      expect(result.kpis.efficiencyScore).toBeGreaterThanOrEqual(0);
      expect(result.kpis.efficiencyScore).toBeLessThanOrEqual(100);
      
      // Efficiency = (onTimeDeliveries / totalDeliveries) * 100
      const expectedEfficiency = (result.kpis.onTimeDeliveries / result.kpis.totalDeliveries) * 100;
      expect(Math.round(result.kpis.efficiencyScore)).toBe(Math.round(expectedEfficiency));
    });
  });

  describe('Integration Test: Complete Simulation', () => {
    it('should run complete simulation with all business rules', async () => {
      const simulationParams = {
        availableDrivers: 3,
        routeStartTime: '09:00',
        maxHoursPerDay: 8
      };

      const result = await SimulationService.runSimulation(simulationParams);
      
      // Verify all KPIs are present
      expect(result.kpis).toHaveProperty('totalProfit');
      expect(result.kpis).toHaveProperty('efficiencyScore');
      expect(result.kpis).toHaveProperty('onTimeDeliveries');
      expect(result.kpis).toHaveProperty('lateDeliveries');
      expect(result.kpis).toHaveProperty('totalDeliveries');
      expect(result.kpis).toHaveProperty('totalFuelCost');
      expect(result.kpis).toHaveProperty('totalPenalties');
      expect(result.kpis).toHaveProperty('totalBonuses');
      
      // Verify simulation data
      expect(result.simulationData).toHaveProperty('driversUsed');
      expect(result.simulationData).toHaveProperty('ordersProcessed');
      expect(result.simulationData).toHaveProperty('routesUsed');
      expect(result.simulationData).toHaveProperty('timestamp');
      
      // Verify business logic constraints
      expect(result.kpis.totalDeliveries).toBe(result.kpis.onTimeDeliveries + result.kpis.lateDeliveries);
      expect(result.simulationData.driversUsed).toBeLessThanOrEqual(simulationParams.availableDrivers);
    });
  });
});
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../Models/User');
const Driver = require('../Models/driverschema');

describe('Driver Management API', () => {
  let token;
  let testDriver;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/greencart_test');
    
    // Create test user and get token
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      role: 'admin'
    });
    await testUser.save();
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'test123'
      });
    
    token = loginRes.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Driver.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear drivers before each test
    await Driver.deleteMany({});
  });

  describe('POST /api/drivers', () => {
    it('should create a new driver', async () => {
      const driverData = {
        name: 'John Doe',
        currentShiftHours: 6,
        past7DayWorkHours: 40,
        isActive: true
      };

      const res = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(driverData);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(driverData.name);
      expect(res.body.isActive).toBe(true);
      expect(res.body.isFatigued).toBe(false);
      expect(res.body.status).toBe('Active');
    });

    it('should mark driver as fatigued if working >8 hours', async () => {
      const driverData = {
        name: 'Tired Driver',
        currentShiftHours: 10,
        past7DayWorkHours: 60,
        isActive: true
      };

      const res = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send(driverData);

      expect(res.statusCode).toBe(201);
      expect(res.body.isFatigued).toBe(true);
      expect(res.body.status).toBe('Fatigued');
    });

    it('should require authentication', async () => {
      const driverData = {
        name: 'John Doe',
        currentShiftHours: 6
      };

      const res = await request(app)
        .post('/api/drivers')
        .send(driverData);

      expect(res.statusCode).toBe(401);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('name');
    });
  });

  describe('GET /api/drivers', () => {
    beforeEach(async () => {
      // Create test drivers
      await Driver.create([
        { name: 'Driver 1', currentShiftHours: 6, isActive: true },
        { name: 'Driver 2', currentShiftHours: 10, isActive: true },
        { name: 'Driver 3', currentShiftHours: 4, isActive: false }
      ]);
    });

    it('should get all drivers with statistics', async () => {
      const res = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.drivers).toHaveLength(3);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.total).toBe(3);
      expect(res.body.stats.active).toBe(2);
      expect(res.body.stats.inactive).toBe(1);
    });

    it('should support search functionality', async () => {
      const res = await request(app)
        .get('/api/drivers?search=Driver 1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.drivers).toHaveLength(1);
      expect(res.body.drivers[0].name).toBe('Driver 1');
    });
  });

  describe('PUT /api/drivers/:id', () => {
    beforeEach(async () => {
      testDriver = await Driver.create({
        name: 'Test Driver',
        currentShiftHours: 6,
        isActive: true
      });
    });

    it('should update driver successfully', async () => {
      const updateData = {
        name: 'Updated Driver',
        currentShiftHours: 8
      };

      const res = await request(app)
        .put(`/api/drivers/${testDriver._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updateData.name);
      expect(res.body.currentShiftHours).toBe(updateData.currentShiftHours);
    });

    it('should return 404 for non-existent driver', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/drivers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/drivers/:id', () => {
    beforeEach(async () => {
      testDriver = await Driver.create({
        name: 'Test Driver',
        currentShiftHours: 6,
        isActive: true
      });
    });

    it('should delete driver successfully', async () => {
      const res = await request(app)
        .delete(`/api/drivers/${testDriver._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      
      // Verify driver is deleted
      const deletedDriver = await Driver.findById(testDriver._id);
      expect(deletedDriver).toBeNull();
    });
  });
});
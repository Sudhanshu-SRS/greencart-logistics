const mongoose = require('mongoose');

beforeAll(async () => {
  // Setup test database connection
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/greencart_test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Clean up and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Global test utilities
global.createTestUser = async (userData = {}) => {
  const User = require('../Models/User');
  const defaultData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    role: 'admin',
    ...userData
  };
  return await User.create(defaultData);
};

global.generateAuthToken = (user) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );
};
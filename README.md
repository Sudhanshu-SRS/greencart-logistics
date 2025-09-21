# 🚀 GreenCart Logistics Management System

## 📋 Project Overview & Purpose

GreenCart Logistics is a comprehensive delivery management system built to optimize logistics operations for modern businesses. The system provides real-time tracking, advanced simulation capabilities, and intelligent route optimization to enhance delivery efficiency and reduce operational costs.

### Key Features

- **Real-time Dashboard** - Monitor KPIs, delivery status, and operational metrics
- **Advanced Simulation Engine** - Run predictive simulations with custom business rules
- **Driver Management** - Track fatigue, work hours, and performance metrics
- **Route Optimization** - Manage delivery routes with traffic-aware planning
- **Order Management** - Complete order lifecycle management
- **Company Rules Implementation** - Automated penalty and bonus calculations
- **Responsive UI** - Modern, mobile-friendly interface with real-time updates

### Business Rules Implemented

1. **Late Delivery Penalty**: ₹50 penalty for deliveries > (base time + 10 minutes)
2. **Driver Fatigue Rule**: 30% speed reduction for drivers working >8 hours
3. **High-Value Bonus**: 10% bonus for orders >₹1000 delivered on time
4. **Fuel Cost Calculation**: ₹5/km base + ₹2/km surcharge for high traffic
5. **Overall Profit**: (order value + bonus - penalties - fuel cost)
6. **Efficiency Score**: (On-time deliveries / Total deliveries) × 100

## 🛠️ Tech Stack Used

### Frontend

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - Responsive CSS framework
- **Chart.js** - Interactive data visualization
- **Axios** - HTTP client for API calls
- **React Toastify** - User notifications

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Joi** - Data validation
- **Bcrypt.js** - Password hashing

### DevOps & Tools

- **ESLint** - Code quality and formatting
- **Morgan** - HTTP request logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-restart

## 🚀 Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** v5.0 or higher
- **npm** v8 or higher

### MongoDB Setup

1. **Install MongoDB Community Edition** (if not already installed):

   - Download from [MongoDB Official Website](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your operating system

2. **Start MongoDB service**:

   **Windows:**

   ```bash
   # Run as Administrator
   net start MongoDB
   ```

   **macOS:**

   ```bash
   brew services start mongodb-community
   ```

   **Linux:**

   ```bash
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.stats()"
   # or for newer versions:
   mongosh --eval "db.stats()"
   ```

### Backend Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd GreenCart-Logistics/Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/logistics
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Seed database with Excel data**

```bash
node utils/seeder.js
```

This will populate your database with:

- **10 drivers** from your Excel data (Amit, Priya, Rohit, Neha, etc.)
- **10 routes** with specific distances and traffic levels
- **50 orders** distributed across all routes with realistic values

5. **Verify data seeding**

```bash
node utils/verify-data.js
```

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend-1
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**
   Create a `.env` file in the frontend-1 directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GreenCart Logistics
```

4. **Start development server**

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Default Login Credentials

After seeding the database, use these credentials:

**Admin Account:**

- Username: `admin`
- Password: `admin123`

**Manager Account:**

- Username: `manager`
- Password: `manager123`

## 🌍 Environment Variables

### Backend (.env)

```env
NODE_ENV=                    # development/production
PORT=                        # Server port (default: 5000)
MONGODB_URI=                 # MongoDB connection string
JWT_SECRET=                  # Secret key for JWT tokens
JWT_EXPIRE=                  # JWT token expiration time
```

### Frontend (.env)

```env
VITE_API_URL=               # Backend API base URL
## 📊 Excel Data Implementation

### Driver Data Structure

The system has been populated with **10 drivers** based on your Excel data:

| Driver Name | Current Shift Hours | Past 7 Days Total | Fatigue Status |
|-------------|-------------------|------------------|----------------|
| Amit        | 6h               | 51h              | Normal         |
| Priya       | 6h               | 51h              | Normal         |
| Rohit       | 10h              | 59h              | High Fatigue   |
| Neha        | 9h               | 56h              | Medium Fatigue |
| Karan       | 7h               | 50h              | Normal         |
| Sneha       | 8h               | 58h              | Medium Fatigue |
| Vikram      | 6h               | 59h              | High Fatigue   |
| Anjali      | 6h               | 51h              | Normal         |
| Manoj       | 9h               | 52h              | Medium Fatigue |
| Pooja       | 10h              | 57h              | High Fatigue   |

### Route Data Structure

**10 routes** with specific distance and traffic parameters:

| Route ID | From → To | Distance | Traffic Level | Base Time |
|----------|-----------|----------|---------------|-----------|
| RT001    | Mumbai Central → Andheri West | 15km | Low | 30min |
| RT002    | Bandra → Powai | 12km | Medium | 45min |
| RT003    | Thane → Navi Mumbai | 18km | High | 60min |
| RT004    | Colaba → Marine Drive | 8km | Low | 20min |
| RT005    | Borivali → Kandivali | 22km | High | 75min |
| RT006    | Dadar → Kurla | 10km | Medium | 35min |
| RT007    | Worli → Mahim | 6km | Low | 15min |
| RT008    | Vashi → Belapur | 14km | Medium | 40min |
| RT009    | Goregaon → Malad | 20km | High | 70min |
| RT010    | Chembur → Ghatkopar | 9km | Medium | 25min |

### Order Data Structure

**50 orders** distributed across all routes with realistic values:

- **5 orders per route** with varying order values
- **Value range**: ₹650 - ₹4200 per order
- **Total order value**: ~₹102,000 across all orders
- **Distribution**: Ensures each route has representative workload

### Business Calculations

The system automatically calculates:

1. **Driver Fatigue Impact**: Based on current shift hours and past 7-day totals
2. **Route Efficiency**: Considering distance, traffic, and time factors
3. **Order Profitability**: Including penalties, bonuses, and fuel costs
4. **KPI Metrics**: Real-time dashboard updates with performance indicators

VITE_APP_NAME=              # Application name
```

## 🚀 Deployment Instructions

### Backend Deployment

1. **Build for production**

```bash
npm install --production
```

2. **Set environment variables**

```bash
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=your_production_mongodb_uri
export JWT_SECRET=your_production_jwt_secret
```

3. **Start production server**

```bash
npm start
```

### Frontend Deployment

1. **Build for production**

```bash
npm run build
```

2. **Serve static files**

```bash
npm run preview
```

### Deployment Platforms

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Postman Collection

📎 **[Download Postman Collection](https://github.com/Sudhanshu-SRS/greencart-logistics/blob/main/docs/GreenCart-API.postman_collection.json)**

### API Endpoints

#### Authentication

```http
POST /auth/register          # User registration
POST /auth/login             # User login
```

#### Drivers Management

```http
GET    /drivers              # Get all drivers with statistics
POST   /drivers              # Create new driver
GET    /drivers/:id          # Get specific driver
PUT    /drivers/:id          # Update driver
DELETE /drivers/:id          # Delete driver
```

#### Routes Management

```http
GET    /routes               # Get all routes
POST   /routes               # Create new route
GET    /routes/:id           # Get specific route
PUT    /routes/:id           # Update route
DELETE /routes/:id           # Delete route
```

#### Orders Management

```http
GET    /orders               # Get all orders
POST   /orders               # Create new order
GET    /orders/:id           # Get specific order
PUT    /orders/:id           # Update order
DELETE /orders/:id           # Delete order
```

#### Simulation Engine

```http
POST   /simulation/run       # Run simulation
GET    /simulation/history   # Get simulation history
GET    /simulation/:id       # Get specific simulation result
```

#### Dashboard Analytics

```http
GET    /dashboard/kpis       # Get key performance indicators
GET    /dashboard/stats      # Get dashboard statistics
```

### Example API Requests & Responses

#### 1. User Registration

**Request:**

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "manager"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "manager"
  }
}
```

#### 2. Create Driver

**Request:**

```http
POST /api/drivers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "currentShiftHours": 6,
  "past7DayWorkHours": 42,
  "isActive": true
}
```

**Response:**

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "name": "John Smith",
  "currentShiftHours": 6,
  "past7DayWorkHours": 42,
  "isActive": true,
  "isFatigued": false,
  "status": "Active",
  "efficiencyRating": "Normal",
  "createdAt": "2023-09-04T10:30:00.000Z"
}
```

#### 3. Run Simulation

**Request:**

```http
POST /api/simulation/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "availableDrivers": 5,
  "routeStartTime": "09:00",
  "maxHoursPerDay": 8
}
```

**Response:**

```json
{
  "kpis": {
    "totalProfit": 15750.5,
    "efficiencyScore": 87.5,
    "onTimeDeliveries": 14,
    "lateDeliveries": 2,
    "totalDeliveries": 16,
    "totalFuelCost": 1200.0,
    "baseFuelCost": 1000.0,
    "trafficSurcharge": 200.0,
    "totalPenalties": 100.0,
    "totalBonuses": 450.0,
    "averageDeliveryTime": 42.5,
    "fuelEfficiency": 13.33
  },
  "simulationData": {
    "driversUsed": 5,
    "ordersProcessed": 16,
    "routesUsed": 8,
    "timestamp": "2023-09-04T10:30:00.000Z",
    "inputParameters": {
      "availableDrivers": 5,
      "routeStartTime": "09:00",
      "maxHoursPerDay": 8
    }
  },
  "simulationId": "64f5a1b2c3d4e5f6a7b8c9d2"
}
```

#### 4. Get Dashboard KPIs

**Request:**

```http
GET /api/dashboard/kpis
Authorization: Bearer <token>
```

**Response:**

```json
{
  "totalProfit": 25600.75,
  "efficiencyScore": 92.3,
  "onTimeDeliveries": 24,
  "lateDeliveries": 2,
  "totalDeliveries": 26,
  "totalFuelCost": 1850.0,
  "baseFuelCost": 1500.0,
  "trafficSurcharge": 350.0,
  "totalPenalties": 100.0,
  "totalBonuses": 720.0
}
```

#### 5. Create Route

**Request:**

```http
POST /api/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "routeId": "RT009",
  "startLocation": "Mumbai Central",
  "endLocation": "Andheri West",
  "distanceKm": 12.5,
  "trafficLevel": "Medium",
  "baseTimeMinutes": 45,
  "isActive": true
}
```

**Response:**

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d3",
  "routeId": "RT009",
  "startLocation": "Mumbai Central",
  "endLocation": "Andheri West",
  "distanceKm": 12.5,
  "trafficLevel": "Medium",
  "baseTimeMinutes": 45,
  "isActive": true,
  "trafficMultiplier": 1.2,
  "fuelSurcharge": 0,
  "createdAt": "2023-09-04T10:30:00.000Z"
}
```

### Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description",
  "details": "Detailed error information",
  "field": "fieldName"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📁 Project Structure

```
greencart-logistics/
├── Backend/
│   ├── Models/                 # Database schemas
│   │   ├── User.js
│   │   ├── driverschema.js
│   │   ├── routtesschema.js
│   │   ├── orderSchema.js
│   │   └── simulationResultSchema.js
│   ├── routes/                 # API route handlers
│   │   ├── AuthR.js
│   │   ├── DashboardR.js
│   │   ├── DriversR.js
│   │   ├── OrdersR.js
│   │   ├── Routes.js
│   │   └── SimulationR.js
│   ├── Middleware/            # Custom middleware
│   │   └── auth.js
│   ├── services/              # Business logic services
│   │   └── SimulationService.js
│   ├── utils/                 # Utilities and helpers
│   │   ├── seeder.js
│   │   └── validation.js
│   ├── server.js              # Main server file
│   ├── startup.js             # Database startup
│   └── package.json
└── frontend-1/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── Modal.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/            # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Drivers.jsx
    │   │   ├── Login.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Register.jsx
    │   │   ├── Routes.jsx
    │   │   └── Simulation.jsx
    │   ├── context/          # React context providers
    │   │   └── AuthContext.jsx
    │   ├── services/         # API service layer
    │   │   └── api.js
    │   └── styles/           # CSS stylesheets
    │       ├── App.css
    │       ├── Auth.css
    │       ├── Dashboard.css
    │       ├── Management.css
    │       ├── Modal.css
    │       ├── Navbar.css
    │       └── Simulation.css
    ├── public/               # Static assets
    └── package.json
```

## 🔧 Available Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🐳 Docker Support

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Manual Docker Setup

```bash
# Build backend
docker build -t greencart-backend ./Backend

# Build frontend
docker build -t greencart-frontend ./frontend-1

# Run with docker network
docker network create greencart-network
docker run -d --name mongodb --network greencart-network mongo:latest
docker run -d --name backend --network greencart-network -p 5000:5000 greencart-backend
docker run -d --name frontend --network greencart-network -p 3000:3000 greencart-frontend
```

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm test
```

### Frontend Tests

```bash
cd frontend-1
npm test
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Joi schema validation for all inputs
- **CORS Protection** - Configured cross-origin resource sharing
- **Helmet Security** - Security headers and protection
- **Rate Limiting** - API rate limiting to prevent abuse

## 📈 Performance Optimizations

- **Database Indexing** - Optimized MongoDB indexes
- **Virtual Fields** - Computed fields for better performance
- **Pagination** - Efficient data loading with pagination
- **Caching** - Strategic caching for frequently accessed data
- **Code Splitting** - React lazy loading for better bundle sizes
- **Image Optimization** - Optimized asset delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation for changes
- Ensure code passes all tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please contact:

- **Email**: sudhanshu.srs@example.com
- **GitHub Issues**: [Create an issue](https://github.com/Sudhanshu-SRS/greencart-logistics/issues)
- **Documentation**: [Project Wiki](https://github.com/Sudhanshu-SRS/greencart-logistics/wiki)

## 🙏 Acknowledgments

- **MongoDB** - Database technology
- **React Team** - Frontend framework
- **Express.js** - Backend framework
- **Vite** - Build tool and development server
- **Bootstrap** - CSS framework

---

**Built with ❤️ for modern logistics management**

## 📊 Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Driver Management

![Drivers](docs/screenshots/drivers.png)

### Simulation Engine

![Simulation](docs/screenshots/simulation.png)

_Note: Screenshots can be found in the `docs/screenshots/` directory_

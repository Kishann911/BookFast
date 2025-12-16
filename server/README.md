# BookFast Server - Backend API

This directory contains the Node.js/Express backend for the BookFast real-time resource booking system.

## 📁 Directory Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── bookingController.js  # Booking CRUD operations
│   ├── resourceController.js # Resource management
│   ├── adminController.js    # Admin-specific operations
│   └── dashboardController.js # Dashboard statistics
├── models/
│   ├── User.js              # User schema and model
│   ├── Resource.js          # Resource schema and model
│   └── Booking.js           # Booking schema and model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── bookings.js          # Booking routes
│   ├── resources.js         # Resource routes
│   ├── admin.js             # Admin routes
│   └── dashboard.js         # Dashboard routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── socket/
│   └── socketHandler.js     # Socket.IO event handlers
├── utils/
│   └── email.js             # Email utility functions
├── uploads/                 # Uploaded files (images)
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── server.js               # Application entry point
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration (see Environment Variables section below).

4. **Start the server**:
   
   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5001` (or the port specified in `.env`).

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bookfast
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookfast

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional - for booking confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=BookFast <noreply@bookfast.com>

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

> ⚠️ **Security Note**: Never commit the `.env` file to version control. Use `.env.example` as a template.

## 📦 Dependencies

### Production Dependencies

- **express** (^4.18.2) - Web framework
- **mongoose** (^8.0.0) - MongoDB ODM
- **socket.io** (^4.7.0) - Real-time bidirectional communication
- **jsonwebtoken** (^9.0.2) - JWT authentication
- **bcryptjs** (^2.4.3) - Password hashing
- **cors** (^2.8.5) - Cross-origin resource sharing
- **dotenv** (^16.3.1) - Environment variable management
- **multer** (^2.0.2) - File upload handling
- **sharp** (^0.34.5) - Image processing
- **nodemailer** (^7.0.11) - Email sending
- **tesseract.js** (^7.0.0) - OCR for resource images

### Development Dependencies

- **nodemon** (^3.0.1) - Auto-restart on file changes

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/update` | Update user profile | Yes |

### Resources (`/api/resources`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all resources | No |
| GET | `/all` | Get all resources (admin) | Yes (Admin) |
| GET | `/:id` | Get single resource | No |
| POST | `/` | Create resource | Yes (Admin) |
| PUT | `/:id` | Update resource | Yes (Admin) |
| DELETE | `/:id` | Delete resource | Yes (Admin) |
| POST | `/:id/upload` | Upload resource image | Yes (Admin) |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's bookings | Yes |
| GET | `/all` | Get all bookings (admin) | Yes (Admin) |
| GET | `/resource/:id` | Get bookings for resource | No |
| GET | `/:id` | Get single booking | Yes |
| POST | `/` | Create booking | Yes |
| PUT | `/:id` | Update booking | Yes |
| DELETE | `/:id` | Cancel booking | Yes |
| POST | `/check-conflict` | Check for conflicts | Yes |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get dashboard statistics | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes (Admin) |
| PUT | `/users/:id/role` | Update user role | Yes (Admin) |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |

## 🔌 Socket.IO Events

### Client → Server

- `join:resource` - Join a resource room for updates
- `leave:resource` - Leave a resource room

### Server → Client

- `bookingCreated` - New booking created
- `bookingUpdated` - Booking updated
- `bookingCancelled` - Booking cancelled

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Resource Model
```javascript
{
  name: String,
  type: String (enum: ['room', 'desk', 'office', 'equipment', 'vehicle', 'other']),
  capacity: Number,
  description: String,
  location: String,
  images: [String],
  amenities: [String],
  status: String (enum: ['available', 'occupied', 'maintenance']),
  isActive: Boolean,
  ocrData: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  userId: ObjectId (ref: User),
  resourceId: ObjectId (ref: Resource),
  startTime: Date,
  endTime: Date,
  status: String (enum: ['confirmed', 'cancelled']),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Mongoose schema validation
- **Rate Limiting**: (TODO: Implement)
- **Helmet**: (TODO: Add security headers)

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas connection
4. Set up email service credentials
5. Configure CORS for production domain

### Recommended Hosting

- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2 or Elastic Beanstalk
- **Railway**: Simple deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set up email service
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Implement rate limiting
- [ ] Add security headers (Helmet)

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not yet implemented)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongod --version`
- Check MONGODB_URI in `.env`
- For Atlas: Whitelist your IP address

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Socket.IO Connection Issues
- Verify CLIENT_URL matches frontend URL
- Check CORS configuration
- Ensure both servers are running

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Socket.IO Documentation](https://socket.io/)
- [JWT.io](https://jwt.io/)

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines.

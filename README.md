# BookFast - Real-Time Resource Booking System

> **Tagline**: If it's booked, you know it. Instantly.

BookFast is a modern, conflict-proof resource booking system built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time updates. It features a brutalist light-themed UI and prevents double bookings through server-side validation and real-time conflict detection.

## ✨ Features

- **🚀 Real-Time Updates**: Socket.IO-powered live booking updates in <100ms
- **🔒 Conflict Prevention**: Server-side validation prevents race conditions and double bookings
- **👥 User Management**: JWT-based authentication with role-based access control (User/Admin)
- **📊 Real-Time Dashboard**: Live statistics showing bookings, resources, and activity
- **🎨 Modern UI**: Brutalist design with cream/beige color palette and bold typography
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔔 Notifications**: Toast notifications for user feedback
- **📧 Email Integration**: Automated booking confirmations and cancellations

## 🏗️ Project Structure

```
BookFast/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Toast, Socket)
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles and variables
│   │   └── assets/        # Images, icons, SVGs
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Node.js backend (Express)
│   ├── config/           # Database and configuration
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication, error handling
│   ├── socket/           # Socket.IO handlers
│   ├── utils/            # Utility functions
│   └── package.json
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd BookFast
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```
   
   See [server/README.md](./server/README.md) for detailed backend setup.

3. **Setup Frontend** (in a new terminal):
   ```bash
   cd client
   npm install
   cp .env.example .env
   # Edit .env if needed
   npm run dev
   ```
   
   See [client/README.md](./client/README.md) for detailed frontend setup.

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

### Default Admin Credentials

For testing purposes, you can create an admin account or use:
- **Email**: admin@bookfast.com
- **Password**: admin123

> ⚠️ **Important**: Change these credentials in production!

## 📚 Documentation

- **[Client Documentation](./client/README.md)** - Frontend setup, components, and styling
- **[Server Documentation](./server/README.md)** - Backend API, database schema, and Socket.IO events

## 🛠️ Development

### Running in Development Mode

**Backend** (runs on port 5001):
```bash
cd server
npm run dev
```

**Frontend** (runs on port 5173):
```bash
cd client
npm run dev
```

### Building for Production

**Frontend**:
```bash
cd client
npm run build
```

The production build will be in `client/dist/`.

**Backend**:
```bash
cd server
npm start
```

## 🔑 Environment Variables

### Server (.env)
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5001
```

See `.env.example` files in each directory for complete configuration options.

## 🎨 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icon library
- **CSS3** - Styling (Brutalist design system)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email sending

## 📖 API Documentation

The backend provides RESTful API endpoints:

- **Authentication**: `/api/auth/*`
- **Resources**: `/api/resources/*`
- **Bookings**: `/api/bookings/*`
- **Admin**: `/api/admin/*`
- **Dashboard**: `/api/dashboard/*`

See [server/README.md](./server/README.md) for complete API documentation.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variable protection
- Input validation and sanitization
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Built with ❤️ using the MERN stack + Socket.IO

## 🙏 Acknowledgments

- Design inspired by modern brutalist web design
- Icons by Lucide React
- Fonts: Fredoka, Space Grotesk, Inter
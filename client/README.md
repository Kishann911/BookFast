# BookFast Client - Frontend Application

This directory contains the React frontend for the BookFast real-time resource booking system, built with Vite and featuring a modern brutalist design.

## 📁 Directory Structure

```
client/
├── public/
│   └── assets/              # Static assets (images, icons)
├── src/
│   ├── assets/             # SVG icons and images
│   │   └── bornfire.svg   # BookFast logo
│   ├── components/         # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Calendar.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── TimeSlotPicker.jsx
│   │   └── *.css          # Component styles
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── SocketContext.jsx  # Socket.IO connection
│   │   └── ToastContext.jsx   # Toast notifications
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── MyBookings.jsx     # User's bookings
│   │   ├── NewBooking.jsx     # Create booking
│   │   ├── Resources.jsx      # Browse resources
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   ├── Settings.jsx       # User settings
│   │   └── *.css             # Page styles
│   ├── styles/            # Global styles
│   │   ├── variables.css      # CSS variables
│   │   └── global.css         # Global styles
│   ├── App.jsx            # Root component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Base styles
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if you need to change the API URL (see Environment Variables section).

4. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 🔧 Environment Variables

Create a `.env` file in the client directory:

```env
# API URL (backend server)
VITE_API_URL=http://localhost:5001

# Optional: Enable debug mode
VITE_DEBUG=false
```

> **Note**: Vite requires environment variables to be prefixed with `VITE_`.

## 📦 Dependencies

### Production Dependencies

- **react** (^19.2.0) - UI library
- **react-dom** (^19.2.0) - React DOM renderer
- **react-router-dom** (^7.10.1) - Client-side routing
- **axios** (^1.13.2) - HTTP client for API requests
- **socket.io-client** (^4.8.1) - Real-time communication
- **lucide-react** (^0.561.0) - Icon library
- **date-fns** (^4.1.0) - Date utility library

### Development Dependencies

- **vite** (^7.2.4) - Build tool and dev server
- **@vitejs/plugin-react** (^5.1.1) - Vite React plugin
- **eslint** (^9.39.1) - Code linting
- **eslint-plugin-react-hooks** (^7.0.1) - React Hooks linting
- **eslint-plugin-react-refresh** (^0.4.24) - React Refresh linting

## 🎨 Design System

### Color Palette

The application uses a brutalist light theme:

```css
--dash-bg-cream: #F5F1E8;      /* Background cream */
--dash-bg-beige: #F5E6D3;      /* Background beige */
--dash-white: #FFFFFF;          /* White */
--dash-green: #6BA353;          /* Primary green */
--dash-blue: #4A90E2;           /* Secondary blue */
--dash-text-dark: #1a1a1a;      /* Dark text */
--dash-text-med: #4a4a4a;       /* Medium text */
```

### Typography

- **Headings**: Fredoka (bold, uppercase)
- **Body**: Space Grotesk
- **UI Elements**: Inter

### Design Principles

- **Sharp Edges**: No border-radius (brutalist style)
- **Bold Borders**: 2-3px solid borders
- **Offset Shadows**: `6px 6px 0` box shadows
- **High Contrast**: Dark text on light backgrounds

## 🧩 Component Library

### Core Components

#### Button
```jsx
<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>
```
Variants: `primary`, `secondary`, `outline`, `ghost`

#### Card
```jsx
<Card className="custom-class">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### Badge
```jsx
<Badge variant="success">Confirmed</Badge>
```
Variants: `success`, `warning`, `error`, `default`

#### Modal
```jsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
  footer={<Button>Action</Button>}
>
  Modal content
</Modal>
```

#### Calendar
```jsx
<Calendar 
  onDateSelect={handleDateSelect}
  selectedDate={selectedDate}
  bookedSlots={bookedSlots}
/>
```

#### TimeSlotPicker
```jsx
<TimeSlotPicker
  selectedSlot={selectedSlot}
  onSlotSelect={handleSlotSelect}
  availableSlots={availableSlots}
/>
```

## 🔐 Authentication

The app uses JWT-based authentication with the AuthContext:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state
}
```

## 🔌 Real-Time Features

Socket.IO integration via SocketContext:

```jsx
import { useSocket } from '../contexts/SocketContext';

function MyComponent() {
  const socket = useSocket();
  
  useEffect(() => {
    socket.on('bookingCreated', handleNewBooking);
    return () => socket.off('bookingCreated', handleNewBooking);
  }, [socket]);
}
```

## 📱 Routing

Routes are defined in `App.jsx`:

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/my-bookings` - User's bookings (protected)
- `/bookings/new` - Create new booking (protected)
- `/resources` - Browse resources (protected)
- `/admin` - Admin dashboard (admin only)
- `/settings` - User settings (protected)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use CSS modules or scoped styles
- Keep components small and focused
- Use meaningful variable names

### Adding New Pages

1. Create component in `src/pages/`
2. Create corresponding CSS file
3. Add route in `App.jsx`
4. Update navigation if needed

### Adding New Components

1. Create component in `src/components/`
2. Create corresponding CSS file
3. Export from component file
4. Import where needed

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Static Hosting
Upload the `dist/` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages

### Environment Variables for Production

Set these in your hosting platform:
```env
VITE_API_URL=https://your-api-domain.com
```

## 🧪 Testing

Testing setup (to be implemented):

```bash
# Run tests
npm test
```

## 🎯 Performance Optimization

- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Use WebP format, lazy loading
- **Bundle Size**: Analyze with `vite-bundle-visualizer`
- **Caching**: Service worker for offline support (TODO)

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Verify backend server is running on port 5001
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines.

## 🎨 Design Credits

- **Fonts**: Fredoka, Space Grotesk, Inter (Google Fonts)
- **Icons**: Lucide React
- **Design Style**: Modern Brutalism

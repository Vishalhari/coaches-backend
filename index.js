import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

// CORS configuration
// app.use(cors({ 
//   origin: ["http://localhost:4000", "http://localhost:4001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors({
  origin: "http://localhost:4000", // your frontend port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug log for all requests
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Billiards CMS API is running!", 
    status: "success",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/",
      auth: "/api/auth/login"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found", 
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
});
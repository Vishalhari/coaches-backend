import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email and password are required",
          success: false 
        });
      }
      
      const user = await User.findOne({ email });   console.log(user);
  
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid credentials", 
          success: false 
        });
      }

      console.log(password);
  
      const isMatch = await bcrypt.compare(password, user.password); console.log(isMatch);
      if (!isMatch) {
        return res.status(401).json({ 
          message: "Invalid credentials", 
          success: false 
        });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      
      res.json({ 
        message: "Login successful", 
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      res.status(500).json({ 
        message: "Server error", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  };
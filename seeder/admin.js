import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from '../config/db.js'
import User from "../models/User.js";

dotenv.config();


const seedAdmin = async () => {
    try {
      await connectDB();
  
      const adminEmail = "admin@gmail.com";
      const adminPassword = "admin@123456";
  
      const existing = await User.findOne({ email: adminEmail });
  
      if (existing) {
        console.log("⚠️ Admin user already exists:", adminEmail);
        process.exit(0);
      }
  
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
      const admin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
      });
  
      await admin.save();
  
      console.log("✅ Admin user created successfully:");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
  
      process.exit(0);
    } catch (error) {
      console.error("❌ Seeding error:", error.message);
      process.exit(1);
    }
  };
  
  seedAdmin();
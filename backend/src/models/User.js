const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Bhai, naam toh daalna padega!"] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  // 1. Current/Last Known Location (Asli Magic Yahan Hai)
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude] -> MongoDB yahi order mangta hai
      default: [73.8567, 18.5204] // Default Pune ke coordinates
    }
  },
  // 2. City (Agar GPS off ho toh backup ke liye)
  city: { 
    type: String, 
    default: "Pune" 
  },
  // 3. User Status
  isOnline: { 
    type: Boolean, 
    default: false 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  }

}, { timestamps: true });
// Sabse Important: Geo-Spatial Indexing
// Iske bina tu radius-based alert (e.g. 5km radius) nahi bhej payega
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
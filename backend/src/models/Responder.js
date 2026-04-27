const mongoose = require('mongoose');

const ResponderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Responder ka naam zaroori hai!"],
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true // Taaki email hamesha same format mein rahe
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  phoneNumber: { 
    type: String, // Number ki jagah String use kar
    required: true,
    unique: true
  },
  organization: { 
    type: String, 
    required: true 
  },
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      default: [73.8567, 18.5204] // [Longitude, Latitude] - Pune Center
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Geospatial Index for location-based search
ResponderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Responder', ResponderSchema);
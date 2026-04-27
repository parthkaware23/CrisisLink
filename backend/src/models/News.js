const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  mediaUrl: { 
    type: String 
  },
  mediaType: { type: String, enum: ['image', 'video'], required: true },

  locationName: { 
    type: String, 
    required: true 
  },
  country : {
    type : String,
    required : true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('News', NewsSchema);
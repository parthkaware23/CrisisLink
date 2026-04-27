const mongoose = require('mongoose');

const BustRequestSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
    index: true 
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  evidenceLinks: [{
    url: String,
    fileType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'image/jpeg', 'image/png', 'image/jpg'], 
      default: 'IMAGE'
    },
    publicId: String 
  }],
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'VERIFIED', 'DEBUNKED'],
    default: 'PENDING',
    index: true 
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Responder',
    default: null,
    index: true
  },
  assignedAt: {
    type: Date, 
    default: null
  },
  resolutionNote: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true
});

BustRequestSchema.index({ status: 1, assignedTo: 1 });

module.exports = mongoose.model('BustRequest', BustRequestSchema);
import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  source: {
    name: { type: String, required: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  destination: {
    name: { type: String, required: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  rideDate: {
    type: Date,
    required: true
  },

  tags: {
    type: [String],
    enum: ['Vacation', 'Work', 'Exams', 'Airport'],
    default: []
  },

  description: {
    type: String,
    required: true
  },

  noteForJoiners: {
    type: String,
    required: true,
    default: ""
  },

  cost: {
    type: Number,
    required: true
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],

  maxMembers: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['Available', 'Filling Fast', 'Full'],
    default: 'Available'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

rideSchema.index({ 'source.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema);

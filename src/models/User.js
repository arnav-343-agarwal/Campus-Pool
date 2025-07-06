import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  joinedRides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: []
  }],

  createdRides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: []
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const roommateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 22,
    },
    gender: {
      type: String,
      default: 'Any',
    },
    occupation: {
      type: String,
      default: 'Student, APSU Rewa',
    },
    location: {
      type: String,
      default: 'University Area, Rewa',
    },
    locality: {
      type: String,
      default: 'University Area, Rewa',
    },
    city: {
      type: String,
      default: 'Rewa',
    },
    budget: {
      type: String,
      default: '₹3,000 - ₹5,000',
    },
    budgetMin: {
      type: Number,
      default: 3000,
    },
    budgetMax: {
      type: Number,
      default: 6000,
    },
    lookingFor: {
      type: String,
      default: 'Single Room or 2BHK Partner',
    },
    matchScore: {
      type: Number,
      default: 90,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    collegeIdVerified: {
      type: Boolean,
      default: true,
    },
    verifiedKyc: {
      type: Boolean,
      default: true,
    },
    moveIn: {
      type: String,
      default: 'Immediate',
    },
    diet: {
      type: String,
      default: 'Vegetarian',
    },
    habits: {
      type: [String],
      default: ['Non-smoker', 'Early riser', 'Clean & Organized'],
    },
    preferences: {
      type: [String],
      default: ['Non-smoker', 'Quiet study hours'],
    },
    bio: {
      type: String,
      default: '',
    },
    requestStatus: {
      type: String,
      enum: ['none', 'sent', 'received', 'connected', 'declined'],
      default: 'none',
    },
    roommateType: {
      type: String,
      enum: ['looking_for_room', 'looking_for_roommate'],
      default: 'looking_for_room',
    },
    availabilityStatus: {
      type: String,
      enum: ['looking_for_room', 'found_a_room', 'looking_for_roommate', 'roommate_found', 'LOOKING', 'ROOMMATE_FOUND'],
      default: 'looking_for_room',
    },
    userId: {
      type: String,
      default: '',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roommateSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  },
});

export const Roommate = mongoose.models.Roommate || mongoose.model('Roommate', roommateSchema);
export default Roommate;

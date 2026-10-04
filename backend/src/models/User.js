import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      default: '',
    },
    passwordHash: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Renter & Seeker',
    },
    city: {
      type: String,
      default: 'Rewa, MP',
    },
    avatar: {
      type: String,
      default: '',
    },
    budget: {
      type: Number,
      default: 5000,
    },
    preferredType: {
      type: String,
      default: 'Room',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    govtIdApproved: {
      type: Boolean,
      default: false,
    },
    collegeIdApproved: {
      type: Boolean,
      default: false,
    },
    trustLevel: {
      type: String,
      default: 'Verified Member',
    },
    memberSince: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    },
    ownedPropertyIds: {
      type: [String],
      default: [],
    },
    savedProperties: {
      type: [String],
      default: [],
    },
    savedRoommates: {
      type: [String],
      default: [],
    },
    roommateType: {
      type: String,
      default: 'looking_for_room',
    },
    roommateStatus: {
      type: String,
      default: 'looking_for_room',
    },
    blockedUsers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for id
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

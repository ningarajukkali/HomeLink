import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    isDemo: { type: Boolean, default: false },
    title: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    fullAddress: { type: String, default: '' },
    rent: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    roomType: { type: String, default: 'Private Room' },
    sharingCapacity: { type: Number, default: 1 },
    currentOccupants: { type: Number, default: 0 },
    furnishedStatus: { type: String, default: 'Semi-Furnished' },
    availableFrom: { type: String, default: '' },
    availableDisplay: { type: String, default: 'Immediate' },
    genderPreference: { type: String, default: 'Any (Students / Working)' },
    floor: { type: String, default: '1st Floor' },
    commuteTimeMins: { type: Number, default: 15 },
    nearbyLandmarks: [{ type: String }],
    images: [{ type: String }],
    amenities: [{ type: String }],
    hasWifi: { type: Boolean, default: false },
    hasAttachedBath: { type: Boolean, default: false },
    hasKitchen: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    hasAC: { type: Boolean, default: false },
    hasLaundry: { type: Boolean, default: false },
    electricityRule: { type: String, default: '' },
    description: { type: String, default: '' },
    livingArrangement: { type: String, default: '' },
    thingsToKnow: [{ type: String }],
    owner: {
      name: { type: String, default: 'Property Owner' },
      phone: { type: String, default: '' },
      role: { type: String, default: 'Property Owner' },
      verified: { type: Boolean, default: true },
      isVerified: { type: Boolean, default: true },
      memberSince: { type: String, default: 'Jan 2024' },
      responseTime: { type: String, default: 'Usually responds in 30 mins' },
      email: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    verifiedBadge: { type: Boolean, default: true },
    verificationChecklist: {
      ownershipVerified: { type: Boolean, default: true },
      rentLockGuaranteed: { type: Boolean, default: true },
      safetyInspected: { type: Boolean, default: true },
      billsDocumented: { type: Boolean, default: true },
    },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 5 },
    ownerId: { type: String, default: '' },
    createdBy: { type: String, default: '' },
    isOwnerListing: { type: Boolean, default: false },
    ownerPhone: { type: String, default: '' },
    ownerEmail: { type: String, default: '' },
    viewsCount: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    isRented: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

roomSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;

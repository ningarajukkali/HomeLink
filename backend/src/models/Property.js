import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      default: 'Room',
    },
    bhk: {
      type: String,
      default: '1 RK',
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: 'Rewa',
    },
    rent: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    brokerage: {
      type: Number,
      default: 0,
    },
    furnished: {
      type: String,
      default: 'Semi-Furnished',
    },
    preferredTenant: {
      type: String,
      default: 'Students & Working Bachelors',
    },
    availableFrom: {
      type: String,
      default: 'Immediately',
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'rented', 'paused', 'AVAILABLE', 'RENTED', 'TEMPORARILY_UNAVAILABLE'],
      default: 'available',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    minimumStay: {
      type: String,
      default: '3 Months',
    },
    bathroom: {
      type: String,
      default: 'Attached Private',
    },
    ac: {
      type: String,
      default: 'Ceiling Fan & Cooler Point',
    },
    furniture: {
      type: String,
      default: 'Bed, Desk & Wardrobe',
    },
    kitchen: {
      type: String,
      default: 'Shared Kitchen Space',
    },
    water: {
      type: String,
      default: '24/7 Water Supply',
    },
    electricity: {
      type: String,
      default: 'Separate Sub-meter',
    },
    parking: {
      type: String,
      default: 'Two-wheeler Covered',
    },
    geyser: {
      type: String,
      default: 'Geyser Installed',
    },
    washingMachine: {
      type: String,
      default: 'Available',
    },
    cctv: {
      type: String,
      default: '24/7 Security CCTV',
    },
    food: {
      type: String,
      default: 'Self-cook / Tiffin Nearby',
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      name: { type: String, default: 'Property Owner' },
      type: { type: String, default: 'Verified Owner' },
      joinedYear: { type: String, default: '2024' },
      phoneMasked: { type: String, default: '+91 98260 •••••' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      responseRate: { type: String, default: '15 mins' },
      verifiedKyc: { type: Boolean, default: true },
      id: { type: String, default: '' },
    },
    ownerId: {
      type: String,
      default: '',
      index: true,
    },
    distance: {
      type: String,
      default: 'Rewa City Center',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.virtual('photos').get(function () {
  return (this.images || []).map(url => ({ imageUrl: url }));
});

propertySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  },
});

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;

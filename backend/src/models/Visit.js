import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    roomId: { type: String, required: true },
    roomTitle: { type: String, default: 'Room Visit' },
    roomArea: { type: String, default: '' },
    roomRent: { type: Number, default: 0 },
    roomImage: { type: String, default: '' },
    
    // Visitor / Tenant details
    visitorName: { type: String, default: '' },
    tenantName: { type: String, default: '' },
    phone: { type: String, default: '' },
    tenantPhone: { type: String, default: '' },
    userId: { type: String, default: '' },

    // Owner details
    ownerName: { type: String, default: '' },
    ownerPhone: { type: String, default: '' },
    ownerId: { type: String, default: '' },

    // Appointment details
    visitDate: { type: String, default: '' },
    requestedDate: { type: String, default: '' },
    timeSlot: { type: String, default: '' },
    requestedTime: { type: String, default: '' },
    notes: { type: String, default: '' },
    message: { type: String, default: '' },

    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Cancelled', 'Confirmed', 'Completed'],
      default: 'Pending',
    },
    requestedAt: { type: String, default: () => new Date().toISOString() },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

visitSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
export default Visit;

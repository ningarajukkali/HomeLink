import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: String,
      default: 'anonymous',
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      default: 'property',
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

reportSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;

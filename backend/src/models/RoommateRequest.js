import mongoose from 'mongoose';

const roommateRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      default: 'Hi, I saw your roommate profile on HomeLink and would like to connect!',
    },
    status: {
      type: String,
      enum: ['pending', 'connected', 'declined', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

roommateRequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

roommateRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const RoommateRequest =
  mongoose.models.RoommateRequest || mongoose.model('RoommateRequest', roommateRequestSchema);
export default RoommateRequest;

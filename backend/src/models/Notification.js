import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: 'all',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: 'Just now',
    },
    read: {
      type: Boolean,
      default: false,
    },
    actionRoute: {
      type: String,
      default: 'dashboard',
    },
    type: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  },
});

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;

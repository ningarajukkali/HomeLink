import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `msg-${Date.now()}` },
    sender: { type: String, required: true },
    senderName: { type: String, default: 'User' },
    text: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    isMe: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true },
    participants: [{ type: String, index: true }],
    participantNames: [{ type: String }],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    messages: [messageSchema],
  },
  { timestamps: true }
);

conversationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    if (!ret.id && ret._id) {
      ret.id = ret._id.toString();
    }
    return ret;
  },
});

export const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;

// In-memory chat conversations store
let conversations = [
  {
    id: "conv-1",
    roomId: "room-2",
    recipientType: "partner",
    participant: {
      name: "Amit Kumar",
      role: "Current Room Partner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    messages: [
      {
        id: "m-1",
        sender: "partner",
        text: "Hi! I am Amit, preparing for MPPSC. Feel free to ask anything about our room or study schedule!",
        timestamp: "2026-10-02T11:00:00Z"
      }
    ],
    updatedAt: "2026-10-02T11:00:00Z"
  },
  {
    id: "conv-2",
    roomId: "room-1",
    recipientType: "owner",
    participant: {
      name: "Ramesh Sharma",
      role: "Property Owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    messages: [
      {
        id: "m-2",
        sender: "owner",
        text: "Namaste! Room is clean and ready for immediate possession. Let me know when you would like to visit.",
        timestamp: "2026-10-02T12:30:00Z"
      }
    ],
    updatedAt: "2026-10-02T12:30:00Z"
  }
];

/**
 * @desc    Get all active chat conversations
 * @route   GET /api/chat/conversations
 * @access  Public
 */
export async function getConversations(req, res, next) {
  try {
    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Send a message in a conversation
 * @route   POST /api/chat/messages
 * @access  Public
 */
export async function sendMessage(req, res, next) {
  try {
    const { conversationId, roomId, text, recipientType, participantName } = req.body;

    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Message text cannot be empty');
    }

    let conv = conversations.find(c => c.id === conversationId || (roomId && c.roomId === roomId));

    if (!conv) {
      // Create new conversation
      conv = {
        id: `conv-${Date.now()}`,
        roomId: roomId || 'general',
        recipientType: recipientType || 'owner',
        participant: {
          name: participantName || 'Property Contact',
          role: recipientType === 'partner' ? 'Current Room Partner' : 'Property Owner',
        },
        messages: [],
        updatedAt: new Date().toISOString(),
      };
      conversations.unshift(conv);
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    conv.messages.push(newMessage);
    conv.updatedAt = new Date().toISOString();

    res.status(201).json({
      success: true,
      data: {
        conversationId: conv.id,
        message: newMessage,
      }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getConversations,
  sendMessage,
};

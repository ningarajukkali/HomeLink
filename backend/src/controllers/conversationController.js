import Conversation from '../models/Conversation.js';
import { SEED_CONVERSATIONS } from '../data/seedData.js';

let hasSeededConv = false;
async function ensureSeedConversations() {
  if (hasSeededConv) return;
  try {
    const count = await Conversation.countDocuments();
    if (count === 0) {
      await Conversation.insertMany(SEED_CONVERSATIONS);
    }
    hasSeededConv = true;
  } catch (err) {
    console.warn('⚠️ Conversation seeding error:', err.message);
  }
}

/**
 * @desc    Get user conversations
 * @route   GET /api/conversations
 * @access  Public (or Authenticated)
 */
export async function getConversations(req, res, next) {
  try {
    await ensureSeedConversations();
    const userId = req.user?.id || req.query.userId || 'usr-current';

    let conversations = await Conversation.find({
      $or: [{ participants: userId }, { participants: 'usr-current' }]
    }).sort({ lastMessageAt: -1 });

    if (conversations.length === 0) {
      conversations = SEED_CONVERSATIONS;
    }

    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
      items: conversations,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/conversations/:id/messages
 * @access  Public (or Authenticated)
 */
export async function getMessages(req, res, next) {
  try {
    await ensureSeedConversations();
    const { id } = req.params;

    let conv = await Conversation.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { participants: id }]
    });

    if (!conv) {
      conv = SEED_CONVERSATIONS.find(c => c.id === id || c.participants.includes(id));
    }

    const messages = conv ? conv.messages : [];

    res.json({
      success: true,
      data: messages,
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Send a message in a conversation
 * @route   POST /api/conversations/:id/messages
 * @access  Public (or Authenticated)
 */
export async function sendMessage(req, res, next) {
  try {
    const { id } = req.params;
    const text = req.body.message || req.body.text || '';
    const sender = req.user?.id || req.body.sender || 'me';
    const senderName = req.user?.name || req.body.senderName || 'You';

    if (!text.trim()) {
      res.status(400);
      throw new Error('Message text is required');
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    let conv = await Conversation.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { participants: id }]
    });

    if (!conv) {
      conv = await Conversation.create({
        id: id.startsWith('conv-') ? id : `conv-${id}`,
        participants: [sender, id],
        participantNames: [senderName, 'Roommate'],
        lastMessage: text,
        lastMessageAt: new Date(),
        messages: [newMsg],
      });
    } else {
      conv.messages.push(newMsg);
      conv.lastMessage = text;
      conv.lastMessageAt = new Date();
      await conv.save();
    }

    res.status(201).json({
      success: true,
      data: newMsg,
    });
  } catch (error) {
    next(error);
  }
}

import Notification from '../models/Notification.js';
import { SEED_NOTIFICATIONS } from '../data/seedData.js';

let hasSeededNotif = false;
async function ensureSeedNotifications() {
  if (hasSeededNotif) return;
  try {
    const count = await Notification.countDocuments();
    if (count === 0) {
      await Notification.insertMany(SEED_NOTIFICATIONS);
    }
    hasSeededNotif = true;
  } catch (err) {
    console.warn('⚠️ Notification seeding error:', err.message);
  }
}

export async function getNotifications(req, res, next) {
  try {
    await ensureSeedNotifications();
    const userId = req.user?.id || req.query.userId || 'all';

    let notifs = await Notification.find({
      $or: [{ userId }, { userId: 'all' }]
    }).sort({ createdAt: -1 });

    if (notifs.length === 0) {
      notifs = SEED_NOTIFICATIONS;
    }

    res.json({
      success: true,
      count: notifs.length,
      data: notifs,
      items: notifs,
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { read: true },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notif,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    const userId = req.user?.id || req.query.userId || 'all';
    await Notification.updateMany(
      { $or: [{ userId }, { userId: 'all' }] },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
}

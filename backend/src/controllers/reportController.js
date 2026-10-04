import Report from '../models/Report.js';
import User from '../models/User.js';

export async function createReport(req, res, next) {
  try {
    const { targetId, targetType, reason, details } = req.body;
    const reporterId = req.user?.id || req.body.reporterId || 'anonymous';

    if (!targetId || !reason) {
      res.status(400);
      throw new Error('Target ID and reason are required for reporting');
    }

    const report = await Report.create({
      reporterId,
      targetId,
      targetType: targetType || 'property',
      reason,
      details: details || '',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted for review by HomeLink Trust & Safety Team',
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function blockUser(req, res, next) {
  try {
    const { blockedId } = req.body;
    const userId = req.user?.id || req.body.userId || 'usr-current';

    if (!blockedId) {
      res.status(400);
      throw new Error('User ID to block is required');
    }

    await User.findOneAndUpdate(
      { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
      { $addToSet: { blockedUsers: blockedId } }
    ).catch(() => {});

    res.json({
      success: true,
      message: `User ${blockedId} has been blocked. You will not receive messages or match requests from them.`,
    });
  } catch (error) {
    next(error);
  }
}

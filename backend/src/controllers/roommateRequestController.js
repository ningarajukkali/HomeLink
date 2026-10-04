import RoommateRequest from '../models/RoommateRequest.js';

/**
 * @desc    Send roommate connection request
 * @route   POST /api/roommate-requests
 * @access  Public (or Authenticated)
 */
export async function sendRequest(req, res, next) {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user?.id || req.body.senderId || 'usr-current';

    if (!receiverId) {
      res.status(400);
      throw new Error('Receiver ID is required');
    }

    const request = await RoommateRequest.create({
      senderId,
      receiverId,
      message: message || 'Hi, I would like to connect on HomeLink Rewa!',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Roommate request sent successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get sent requests
 * @route   GET /api/roommate-requests/sent
 * @access  Public (or Authenticated)
 */
export async function getSentRequests(req, res, next) {
  try {
    const senderId = req.user?.id || req.query.senderId || 'usr-current';
    const requests = await RoommateRequest.find({ senderId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
      items: requests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get received requests
 * @route   GET /api/roommate-requests/received
 * @access  Public (or Authenticated)
 */
export async function getReceivedRequests(req, res, next) {
  try {
    const receiverId = req.user?.id || req.query.receiverId || 'usr-current';
    const requests = await RoommateRequest.find({ receiverId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
      items: requests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Accept roommate request
 * @route   PATCH /api/roommate-requests/:id/accept
 * @access  Public (or Authenticated)
 */
export async function acceptRequest(req, res, next) {
  try {
    const { id } = req.params;
    const request = await RoommateRequest.findByIdAndUpdate(
      id,
      { status: 'connected' },
      { new: true }
    );

    if (!request) {
      res.status(404);
      throw new Error(`Request with ID ${id} not found`);
    }

    res.json({
      success: true,
      message: 'Request accepted. You are now connected!',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Decline roommate request
 * @route   PATCH /api/roommate-requests/:id/decline
 * @access  Public (or Authenticated)
 */
export async function declineRequest(req, res, next) {
  try {
    const { id } = req.params;
    const request = await RoommateRequest.findByIdAndUpdate(
      id,
      { status: 'declined' },
      { new: true }
    );

    if (!request) {
      res.status(404);
      throw new Error(`Request with ID ${id} not found`);
    }

    res.json({
      success: true,
      message: 'Request declined',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Cancel sent request
 * @route   PATCH /api/roommate-requests/:id/cancel
 * @access  Public (or Authenticated)
 */
export async function cancelRequest(req, res, next) {
  try {
    const { id } = req.params;
    const request = await RoommateRequest.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!request) {
      res.status(404);
      throw new Error(`Request with ID ${id} not found`);
    }

    res.json({
      success: true,
      message: 'Request cancelled',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

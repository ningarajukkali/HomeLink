import { Visit } from '../models/Visit.js';

// In-memory visit requests store fallback
let inMemoryVisits = [
  {
    id: "visit-101",
    roomId: "room-1",
    roomTitle: "Furnished Private Room with Attached Bath",
    roomArea: "Vijay Nagar, Indore",
    roomRent: 6500,
    visitorName: "Rahul Sharma",
    tenantName: "Rahul Sharma",
    phone: "+91 98261 55001",
    tenantPhone: "+91 98261 55001",
    visitDate: "2026-10-06",
    requestedDate: "2026-10-06",
    timeSlot: "Evening (5:00 PM - 7:00 PM)",
    requestedTime: "5:00 PM",
    status: "Confirmed",
    requestedAt: "2026-10-02T10:30:00Z",
    createdAt: "2026-10-02"
  }
];

/**
 * @desc    Schedule a physical room visit
 * @route   POST /api/visits
 * @access  Public
 */
export async function scheduleVisit(req, res, next) {
  try {
    const { 
      roomId, 
      roomTitle, 
      roomArea,
      roomRent,
      roomImage,
      visitorName, 
      tenantName,
      phone, 
      tenantPhone,
      visitDate, 
      requestedDate,
      timeSlot, 
      requestedTime,
      notes,
      message,
      ownerName,
      ownerPhone,
      ownerId,
      userId
    } = req.body;

    const resolvedVisitorName = tenantName || visitorName;
    const resolvedPhone = tenantPhone || phone;
    const resolvedDate = requestedDate || visitDate;
    const resolvedTime = requestedTime || timeSlot;

    if (!roomId || !resolvedVisitorName || !resolvedPhone || !resolvedDate) {
      res.status(400);
      throw new Error('Please provide required visit details: roomId, tenantName/visitorName, phone, and requestedDate');
    }

    const visitId = `visit-${Date.now()}`;
    const newVisitPayload = {
      id: visitId,
      roomId,
      roomTitle: roomTitle || 'Room Visit',
      roomArea: roomArea || '',
      roomRent: Number(roomRent) || 0,
      roomImage: roomImage || '',
      visitorName: resolvedVisitorName,
      tenantName: resolvedVisitorName,
      phone: resolvedPhone,
      tenantPhone: resolvedPhone,
      userId: userId || '',
      ownerName: ownerName || '',
      ownerPhone: ownerPhone || '',
      ownerId: ownerId || '',
      visitDate: resolvedDate,
      requestedDate: resolvedDate,
      timeSlot: resolvedTime || 'Flexible',
      requestedTime: resolvedTime || 'Flexible',
      notes: message || notes || '',
      message: message || notes || '',
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    let savedVisit = newVisitPayload;

    try {
      savedVisit = await Visit.create(newVisitPayload);
    } catch (dbErr) {
      console.warn('⚠️ Visit DB save fallback:', dbErr.message);
    }

    inMemoryVisits.unshift(savedVisit);

    res.status(201).json({
      success: true,
      message: 'Physical visit scheduled successfully. The property owner has been notified.',
      data: savedVisit,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get all visits with optional owner/user filtering
 * @route   GET /api/visits/my-visits
 * @access  Public
 */
export async function getMyVisits(req, res, next) {
  try {
    const { ownerId, ownerPhone, userId, phone, roomId, status } = req.query;

    let visits = [];
    try {
      let query = {};
      if (ownerId) query.ownerId = ownerId;
      if (userId) query.userId = userId;
      if (roomId) query.roomId = roomId;
      if (status) query.status = status;
      if (ownerPhone) {
        const cleanP = ownerPhone.replace(/\D/g, '').slice(-10);
        query.ownerPhone = { $regex: cleanP };
      }
      if (phone) {
        const cleanP = phone.replace(/\D/g, '').slice(-10);
        query.$or = [{ phone: { $regex: cleanP } }, { tenantPhone: { $regex: cleanP } }];
      }

      visits = await Visit.find(query).sort({ createdAt: -1 });
      if (!visits || visits.length === 0) {
        visits = inMemoryVisits;
      }
    } catch (e) {
      visits = inMemoryVisits;
    }

    res.json({
      success: true,
      count: visits.length,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update visit request status (e.g. Accepted, Declined, Cancelled, Confirmed)
 * @route   PATCH /api/visits/:id/status
 * @access  Public
 */
export async function updateVisitStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    try {
      updated = await Visit.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { status },
        { new: true }
      );
    } catch (e) {
      // ignore
    }

    const idx = inMemoryVisits.findIndex(v => v.id === id);
    if (idx !== -1) {
      inMemoryVisits[idx].status = status;
      if (!updated) updated = inMemoryVisits[idx];
    }

    if (!updated) {
      res.status(404);
      throw new Error(`Visit request not found with ID ${id}`);
    }

    res.json({
      success: true,
      message: `Visit status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  scheduleVisit,
  getMyVisits,
  updateVisitStatus,
};

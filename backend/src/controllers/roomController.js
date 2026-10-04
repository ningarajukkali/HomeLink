import { SEED_ROOMS } from '../data/seedRooms.js';
import { Room } from '../models/Room.js';

// In-memory rooms repository (initialized with seed data for fallback)
let roomsStore = [...SEED_ROOMS];

/**
 * @desc    Get all rooms with filtering, search, and sorting
 * @route   GET /api/rooms
 * @access  Public
 */
export async function getAllRooms(req, res, next) {
  try {
    const { city, area, maxPrice, minPrice, roomType, gender, search, sort, ownerId, ownerPhone } = req.query;

    let rooms = [];

    try {
      let query = {};
      if (ownerId) {
        query.$or = [{ ownerId }, { createdBy: ownerId }];
      }
      if (ownerPhone) {
        const cleanP = ownerPhone.replace(/\D/g, '').slice(-10);
        query.$or = [{ ownerPhone: { $regex: cleanP } }, { 'owner.phone': { $regex: cleanP } }];
      }
      if (city && city !== 'All') {
        query.city = { $regex: new RegExp(`^${city}$`, 'i') };
      }
      if (area) {
        query.area = { $regex: area, $options: 'i' };
      }
      if (roomType && roomType !== 'All') {
        query.roomType = { $regex: new RegExp(`^${roomType}$`, 'i') };
      }
      if (gender && gender !== 'All') {
        query.$or = [
          { genderPreference: { $regex: 'any', $options: 'i' } },
          { genderPreference: { $regex: gender, $options: 'i' } },
        ];
      }
      if (maxPrice || minPrice) {
        query.rent = {};
        if (maxPrice) query.rent.$lte = parseInt(maxPrice, 10);
        if (minPrice) query.rent.$gte = parseInt(minPrice, 10);
      }
      if (search) {
        const qRegex = { $regex: search, $options: 'i' };
        query.$or = [
          { title: qRegex },
          { area: qRegex },
          { city: qRegex },
          { description: qRegex },
          { nearbyLandmarks: qRegex },
        ];
      }

      let sortOption = {};
      if (sort === 'price_asc') sortOption.rent = 1;
      else if (sort === 'price_desc') sortOption.rent = -1;
      else sortOption.createdAt = -1;

      rooms = await Room.find(query).sort(sortOption);

      if ((!rooms || rooms.length === 0) && Object.keys(query).length === 0) {
        // Only if general query had no items, fallback to seed
        rooms = roomsStore;
      }
    } catch (dbErr) {
      console.warn('⚠️ DB query fallback for rooms:', dbErr.message);
      rooms = [...roomsStore];
      if (city && city !== 'All') {
        rooms = rooms.filter(r => r.city.toLowerCase() === city.toLowerCase());
      }
      if (area) {
        rooms = rooms.filter(r => r.area.toLowerCase().includes(area.toLowerCase()));
      }
      if (roomType && roomType !== 'All') {
        rooms = rooms.filter(r => r.roomType.toLowerCase() === roomType.toLowerCase());
      }
      if (maxPrice) {
        rooms = rooms.filter(r => r.rent <= parseInt(maxPrice, 10));
      }
      if (minPrice) {
        rooms = rooms.filter(r => r.rent >= parseInt(minPrice, 10));
      }
    }

    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get single room by ID
 * @route   GET /api/rooms/:id
 * @access  Public
 */
export async function getRoomById(req, res, next) {
  try {
    let room = null;
    try {
      room = await Room.findOne({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
    } catch (e) {
      // ignore
    }

    if (!room) {
      room = roomsStore.find(r => r.id === req.params.id);
    }

    if (!room) {
      res.status(404);
      throw new Error(`Room not found with ID ${req.params.id}`);
    }

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create a new room listing
 * @route   POST /api/rooms
 * @access  Private / Owner
 */
export async function createRoom(req, res, next) {
  try {
    const roomId = req.body.id || `room-${Date.now()}`;
    const roomPayload = {
      ...req.body,
      id: roomId,
      createdAt: req.body.createdAt || new Date().toISOString(),
      isDemo: false,
    };

    let savedRoom = roomPayload;

    try {
      savedRoom = await Room.create(roomPayload);
    } catch (dbErr) {
      console.warn('⚠️ Room DB save fallback:', dbErr.message);
    }

    roomsStore.unshift(savedRoom);

    res.status(201).json({
      success: true,
      message: 'Room listing created successfully',
      data: savedRoom,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update a room listing
 * @route   PUT /api/rooms/:id
 * @access  Private / Owner
 */
export async function updateRoom(req, res, next) {
  try {
    let updatedRoom = null;
    try {
      updatedRoom = await Room.findOneAndUpdate(
        { $or: [{ id: req.params.id }, { _id: req.params.id }] },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
    } catch (e) {
      // ignore
    }

    const index = roomsStore.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      roomsStore[index] = { ...roomsStore[index], ...req.body };
      if (!updatedRoom) updatedRoom = roomsStore[index];
    }

    if (!updatedRoom) {
      res.status(404);
      throw new Error(`Room not found with ID ${req.params.id}`);
    }

    res.json({
      success: true,
      message: 'Room listing updated successfully',
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a room listing
 * @route   DELETE /api/rooms/:id
 * @access  Private / Owner
 */
export async function deleteRoom(req, res, next) {
  try {
    try {
      await Room.findOneAndDelete({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
    } catch (e) {
      // ignore
    }

    const index = roomsStore.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      roomsStore.splice(index, 1);
    }

    res.json({
      success: true,
      message: 'Room listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

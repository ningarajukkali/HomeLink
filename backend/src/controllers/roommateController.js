import Roommate from '../models/Roommate.js';
import { SEED_ROOMMATES } from '../data/seedData.js';

let hasSeededRm = false;
async function ensureSeedRoommates() {
  if (hasSeededRm) return;
  if (Roommate.db?.readyState !== 1) return;
  try {
    for (const rm of SEED_ROOMMATES) {
      const exists = await Roommate.findOne({ id: rm.id });
      if (!exists) {
        await Roommate.create(rm);
      }
    }
    hasSeededRm = true;
  } catch (err) {
    console.warn('⚠️ Roommate seeding check failed:', err.message);
  }
}

/**
 * @desc    Search and list roommates
 * @route   GET /api/roommates/search or GET /api/roommates
 * @access  Public
 */
export async function getRoommates(req, res, next) {
  try {
    await ensureSeedRoommates();

    const {
      locality,
      diet,
      maxBudget,
      occupation,
      searchQuery,
      status,
      roommateType,
      city
    } = req.query;

    const filter = {};

    // City filter
    if (city && city !== 'All Cities' && city !== 'All') {
      const cityClean = city.replace(/ ncr/i, '').trim();
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { city: { $regex: cityClean, $options: 'i' } },
          { location: { $regex: cityClean, $options: 'i' } },
          { locality: { $regex: cityClean, $options: 'i' } }
        ]
      });
    }

    // Locality
    if (locality && locality !== 'All' && locality !== 'All Rewa') {
      filter.locality = { $regex: locality.replace(/,.*$/, '').trim(), $options: 'i' };
    }

    // Diet
    if (diet && diet !== 'All') {
      filter.diet = { $regex: diet, $options: 'i' };
    }

    // Occupation
    if (occupation && occupation !== 'All') {
      filter.occupation = { $regex: occupation, $options: 'i' };
    }

    // Status
    if (status && status !== 'all') {
      filter.availabilityStatus = status;
    }

    // Roommate Type
    if (roommateType && roommateType !== 'all') {
      filter.roommateType = roommateType;
    }

    // Search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { location: regex },
        { locality: regex },
        { occupation: regex },
        { lookingFor: regex },
        { bio: regex }
      ];
    }

    let roommates;
    if (Roommate.db?.readyState === 1) {
      roommates = await Roommate.find(filter).sort({ matchScore: -1, createdAt: -1 });
      if (maxBudget) {
        const budgetNum = Number(maxBudget);
        roommates = roommates.filter(r => !r.budgetMin || r.budgetMin <= budgetNum);
      }
      if (roommates.length === 0 && !searchQuery && !locality) {
        roommates = SEED_ROOMMATES;
      }
    } else {
      roommates = filterRoommatesInMemory(req.query);
    }

    res.json({
      success: true,
      count: roommates.length,
      items: roommates,
      data: roommates,
    });
  } catch (error) {
    console.warn('⚠️ Roommate query fallback to seed:', error.message);
    const roommates = filterRoommatesInMemory(req.query);
    res.json({
      success: true,
      count: roommates.length,
      items: roommates,
      data: roommates,
    });
  }
}

function filterRoommatesInMemory(query) {
  const { city, locality, diet, occupation, searchQuery } = query;
  return SEED_ROOMMATES.filter(r => {
    if (city && city !== 'All Cities' && city !== 'All') {
      const c = city.toLowerCase().replace(/ ncr/i, '');
      const rCity = (r.city || '').toLowerCase();
      const rLoc = (r.location || r.locality || '').toLowerCase();
      if (!rCity.includes(c) && !rLoc.includes(c)) return false;
    }
    if (diet && diet !== 'All' && !(r.diet || '').toLowerCase().includes(diet.toLowerCase())) return false;
    if (occupation && occupation !== 'All' && !(r.occupation || '').toLowerCase().includes(occupation.toLowerCase())) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${r.name} ${r.occupation} ${r.location} ${r.bio || ''}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

/**
 * @desc    Get single roommate profile
 * @route   GET /api/roommates/:id
 * @access  Public
 */
export async function getRoommateById(req, res, next) {
  try {
    await ensureSeedRoommates();
    const { id } = req.params;

    let roommate = await Roommate.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!roommate) {
      roommate = SEED_ROOMMATES.find(r => r.id === id);
    }

    if (!roommate) {
      res.status(404);
      throw new Error(`Roommate profile not found with ID ${id}`);
    }

    res.json({
      success: true,
      data: roommate,
      ...roommate.toJSON ? roommate.toJSON() : roommate
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create roommate profile
 * @route   POST /api/roommates
 * @access  Public (or Authenticated)
 */
export async function createRoommate(req, res, next) {
  try {
    const data = req.body;
    const newId = data.id || `rm-${Date.now()}`;

    const roommate = await Roommate.create({
      ...data,
      id: newId,
      verified: true,
      matchScore: data.matchScore || 90,
    });

    res.status(201).json({
      success: true,
      message: 'Roommate profile created successfully',
      data: roommate,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update roommate status
 * @route   PATCH /api/roommates/:id/status
 * @access  Public (or Authenticated)
 */
export async function updateRoommateStatus(req, res, next) {
  try {
    const { id } = req.params;
    let { status } = req.body;

    if (status === 'ROOMMATE_FOUND') status = 'roommate_found';
    if (status === 'LOOKING') status = 'looking_for_room';

    const roommate = await Roommate.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { availabilityStatus: status },
      { new: true }
    );

    if (!roommate) {
      res.status(404);
      throw new Error(`Roommate with ID ${id} not found`);
    }

    res.json({
      success: true,
      message: `Roommate status updated to ${status}`,
      data: roommate,
    });
  } catch (error) {
    next(error);
  }
}

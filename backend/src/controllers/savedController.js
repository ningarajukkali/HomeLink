import User from '../models/User.js';
import Property from '../models/Property.js';
import Roommate from '../models/Roommate.js';
import { SEED_PROPERTIES, SEED_ROOMMATES } from '../data/seedData.js';

// In-memory fallback if user not in db
let memorySavedProperties = ['prop-1', 'prop-2'];
let memorySavedRoommates = ['rm-1'];

export async function saveProperty(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (userId) {
      await User.findOneAndUpdate(
        { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
        { $addToSet: { savedProperties: id } }
      ).catch(() => {});
    }

    if (!memorySavedProperties.includes(id)) {
      memorySavedProperties.push(id);
    }

    res.json({ success: true, message: 'Property saved to favorites', savedPropertyIds: memorySavedProperties });
  } catch (error) {
    next(error);
  }
}

export async function unsaveProperty(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (userId) {
      await User.findOneAndUpdate(
        { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
        { $pull: { savedProperties: id } }
      ).catch(() => {});
    }

    memorySavedProperties = memorySavedProperties.filter(i => i !== id);
    res.json({ success: true, message: 'Property removed from favorites', savedPropertyIds: memorySavedProperties });
  } catch (error) {
    next(error);
  }
}

export async function getSavedProperties(req, res, next) {
  try {
    const userId = req.user?.id || req.query.userId;
    let savedIds = memorySavedProperties;

    if (userId) {
      const user = await User.findOne({
        $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }]
      });
      if (user && user.savedProperties) {
        savedIds = user.savedProperties;
      }
    }

    const properties = await Property.find({ id: { $in: savedIds } });
    const result = properties.length > 0 ? properties : SEED_PROPERTIES.filter(p => savedIds.includes(p.id));

    res.json({
      success: true,
      count: result.length,
      data: result,
      items: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveRoommate(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (userId) {
      await User.findOneAndUpdate(
        { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
        { $addToSet: { savedRoommates: id } }
      ).catch(() => {});
    }

    if (!memorySavedRoommates.includes(id)) {
      memorySavedRoommates.push(id);
    }

    res.json({ success: true, message: 'Roommate profile saved', savedRoommateIds: memorySavedRoommates });
  } catch (error) {
    next(error);
  }
}

export async function unsaveRoommate(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (userId) {
      await User.findOneAndUpdate(
        { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
        { $pull: { savedRoommates: id } }
      ).catch(() => {});
    }

    memorySavedRoommates = memorySavedRoommates.filter(i => i !== id);
    res.json({ success: true, message: 'Roommate removed from saved', savedRoommateIds: memorySavedRoommates });
  } catch (error) {
    next(error);
  }
}

export async function getSavedRoommates(req, res, next) {
  try {
    const userId = req.user?.id || req.query.userId;
    let savedIds = memorySavedRoommates;

    if (userId) {
      const user = await User.findOne({
        $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }]
      });
      if (user && user.savedRoommates) {
        savedIds = user.savedRoommates;
      }
    }

    const roommates = await Roommate.find({ id: { $in: savedIds } });
    const result = roommates.length > 0 ? roommates : SEED_ROOMMATES.filter(r => savedIds.includes(r.id));

    res.json({
      success: true,
      count: result.length,
      data: result,
      items: result,
    });
  } catch (error) {
    next(error);
  }
}

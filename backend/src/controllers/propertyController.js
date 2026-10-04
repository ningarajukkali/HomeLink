import Property from '../models/Property.js';
import User from '../models/User.js';
import { SEED_PROPERTIES, CITIES } from '../data/seedData.js';

// Auto-seed helper
let hasSeeded = false;
async function ensureSeedProperties() {
  if (hasSeeded) return;
  if (Property.db?.readyState !== 1) return;
  try {
    for (const prop of SEED_PROPERTIES) {
      const exists = await Property.findOne({ id: prop.id });
      if (!exists) {
        await Property.create(prop);
      }
    }
    hasSeeded = true;
  } catch (err) {
    console.warn('⚠️ Property seeding check failed:', err.message);
  }
}

/**
 * @desc    Get supported cities
 * @route   GET /api/properties/cities
 * @access  Public
 */
export async function getCities(req, res, next) {
  try {
    res.json({ success: true, count: CITIES.length, data: CITIES });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Search and list properties
 * @route   GET /api/properties/search or GET /api/properties
 * @access  Public
 */
export async function getProperties(req, res, next) {
  try {
    await ensureSeedProperties();

    const {
      locality,
      propertyTypes,
      minRent,
      maxRent,
      furnishing,
      preferredTenant,
      sortBy,
      searchQuery,
      status,
      ownerId,
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
          { locality: { $regex: cityClean, $options: 'i' } }
        ]
      });
    }

    // Locality filter
    if (locality && locality !== 'All' && locality !== 'All Rewa') {
      filter.locality = { $regex: locality.replace(/,.*$/, '').trim(), $options: 'i' };
    }

    // Property Types filter
    if (propertyTypes) {
      const types = Array.isArray(propertyTypes) ? propertyTypes : propertyTypes.split(',').map(t => t.trim());
      const filteredTypes = types.filter(t => t && t !== 'All');
      if (filteredTypes.length > 0) {
        filter.propertyType = { $in: filteredTypes };
      }
    }

    // Rent Range
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    // Furnishing
    if (furnishing && furnishing !== 'All') {
      filter.furnished = { $regex: furnishing, $options: 'i' };
    }

    // Preferred Tenant
    if (preferredTenant && preferredTenant !== 'All') {
      filter.preferredTenant = { $regex: preferredTenant, $options: 'i' };
    }

    // Availability status
    if (status && status !== 'all') {
      filter.availabilityStatus = status;
    }

    // Owner ID filter
    if (ownerId) {
      filter.$or = [{ ownerId }, { id: { $in: ownerId.split(',') } }];
    }

    // Text / keyword search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { locality: regex },
        { description: regex },
        { propertyType: regex },
        { amenities: regex }
      ];
    }

    // Sorting
    let sortObj = { isFeatured: -1, createdAt: -1 };
    if (sortBy === 'rent_low') {
      sortObj = { rent: 1 };
    } else if (sortBy === 'rent_high') {
      sortObj = { rent: -1 };
    } else if (sortBy === 'rating') {
      sortObj = { rating: -1, reviewsCount: -1 };
    }

    let properties;
    if (Property.db?.readyState === 1) {
      properties = await Property.find(filter).sort(sortObj);
      if (properties.length === 0 && (!searchQuery && !ownerId && !locality)) {
        properties = SEED_PROPERTIES;
      }
    } else {
      properties = filterPropertiesInMemory(req.query);
    }

    res.json({
      success: true,
      count: properties.length,
      items: properties,
      data: properties,
    });
  } catch (error) {
    console.warn('⚠️ Property query fallback to seed:', error.message);
    const properties = filterPropertiesInMemory(req.query);
    res.json({
      success: true,
      count: properties.length,
      items: properties,
      data: properties,
    });
  }
}

function filterPropertiesInMemory(query) {
  const { city, locality, propertyTypes, minRent, maxRent, furnishing, searchQuery } = query;
  return SEED_PROPERTIES.filter(p => {
    if (city && city !== 'All Cities' && city !== 'All') {
      const c = city.toLowerCase().replace(/ ncr/i, '');
      const pCity = (p.city || '').toLowerCase();
      const pLoc = (p.locality || '').toLowerCase();
      if (!pCity.includes(c) && !pLoc.includes(c)) return false;
    }
    if (minRent && p.rent < Number(minRent)) return false;
    if (maxRent && p.rent > Number(maxRent)) return false;
    if (furnishing && furnishing !== 'All' && p.furnished !== furnishing) return false;
    if (propertyTypes) {
      const types = Array.isArray(propertyTypes) ? propertyTypes : propertyTypes.split(',').map(t => t.trim());
      const filteredTypes = types.filter(t => t && t !== 'All');
      if (filteredTypes.length > 0 && !filteredTypes.includes(p.propertyType)) return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${p.title} ${p.locality} ${p.description} ${p.propertyType}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
export async function getPropertyById(req, res, next) {
  try {
    await ensureSeedProperties();
    const { id } = req.params;

    let property = await Property.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!property) {
      // Check in seed properties
      property = SEED_PROPERTIES.find(p => p.id === id);
    }

    if (!property) {
      res.status(404);
      throw new Error(`Property not found with ID ${id}`);
    }

    // Increment views
    if (property.viewsCount !== undefined && typeof property.save === 'function') {
      property.viewsCount += 1;
      await property.save().catch(() => {});
    }

    res.json({
      success: true,
      data: property,
      ...property.toJSON ? property.toJSON() : property
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create new property listing
 * @route   POST /api/properties
 * @access  Public (or Authenticated)
 */
export async function createProperty(req, res, next) {
  try {
    const data = req.body;
    const newId = data.id || `prop-${Date.now()}`;

    const newProperty = await Property.create({
      ...data,
      id: newId,
      availabilityStatus: data.availabilityStatus || 'available',
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      images: data.images && data.images.length > 0 ? data.images : (data.photos || [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ]),
      amenities: data.amenities || [],
    });

    // If ownerId or user session exists, update user's ownedPropertyIds
    const ownerId = data.ownerId || (req.user && req.user.id);
    if (ownerId) {
      await User.findOneAndUpdate(
        { $or: [{ id: ownerId }, { _id: ownerId.match(/^[0-9a-fA-F]{24}$/) ? ownerId : null }] },
        { $addToSet: { ownedPropertyIds: newId } }
      ).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Property listed successfully',
      data: newProperty,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update property availability status
 * @route   PATCH /api/properties/:id/status
 * @access  Public (or Host)
 */
export async function updatePropertyStatus(req, res, next) {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // Normalize status
    if (status === 'AVAILABLE') status = 'available';
    if (status === 'RENTED') status = 'rented';
    if (status === 'TEMPORARILY_UNAVAILABLE' || status === 'PAUSED') status = 'paused';

    const property = await Property.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { availabilityStatus: status },
      { new: true }
    );

    if (!property) {
      res.status(404);
      throw new Error(`Property with ID ${id} not found`);
    }

    res.json({
      success: true,
      message: `Property status updated to ${status}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Compare multiple properties
 * @route   GET /api/properties/compare
 * @access  Public
 */
export async function compareProperties(req, res, next) {
  try {
    await ensureSeedProperties();
    const { ids } = req.query;

    if (!ids) {
      return res.json({ success: true, items: [], data: [] });
    }

    const idList = ids.split(',').map(s => s.trim()).filter(Boolean);

    const properties = await Property.find({
      id: { $in: idList }
    });

    res.json({
      success: true,
      items: properties,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Upload photo for property
 * @route   POST /api/properties/:id/photos
 * @access  Public
 */
export async function uploadPropertyPhoto(req, res, next) {
  try {
    const { id } = req.params;
    // Provide a default high-quality room photo URL
    const uploadedUrl = req.file?.path || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

    await Property.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $push: { images: uploadedUrl } }
    ).catch(() => {});

    res.json({
      success: true,
      imageUrl: uploadedUrl,
      data: { imageUrl: uploadedUrl }
    });
  } catch (error) {
    next(error);
  }
}

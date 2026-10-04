import User from '../models/User.js';
import {
  hashPassword,
  verifyPassword,
  cleanPhone,
  readLocalUsers,
  saveLocalUsers,
  findLocalUserByEmailOrPhone,
  findLocalUserById,
  upsertLocalUser
} from '../data/userStore.js';

function formatUserResponse(u) {
  const phoneClean = cleanPhone(u.phone);
  const emailVal = u.email || '';
  const phoneVal = u.phone || '';

  return {
    id: u.id || u._id?.toString() || `usr-${phoneClean || Date.now()}`,
    name: u.name || 'Member',
    email: emailVal,
    phone: phoneVal,
    phoneMasked: phoneClean ? `+91 ${phoneClean.slice(0, 5)} •••••` : '+91 98261 •••••',
    emailMasked: emailVal.includes('@')
      ? `${emailVal.slice(0, 4)}••••@${emailVal.split('@')[1]}`
      : 'user••••@homelink.in',
    role: u.role || 'Renter & Seeker',
    city: u.city || 'Rewa, MP',
    avatar: u.avatar || '',
    isVerified: u.isVerified ?? true,
    govtIdApproved: u.govtIdApproved ?? false,
    collegeIdApproved: u.collegeIdApproved ?? false,
    trustLevel: u.trustLevel || 'Tier 1 Standard',
    memberSince: u.memberSince || 'Today',
    ownedPropertyIds: u.ownedPropertyIds || [],
    savedProperties: u.savedProperties || [],
    savedRoommates: u.savedRoommates || [],
    roommateType: u.roommateType || 'looking_for_room',
    roommateStatus: u.roommateStatus || 'looking_for_room',
  };
}

/**
 * @desc    Send OTP to phone
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export async function sendOtp(req, res, next) {
  try {
    const { phone } = req.body;
    const digits = cleanPhone(phone);
    if (!digits || digits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    // In production, integrate SMS gateway (Twilio, Gupshup, Fast2SMS)
    const demoOtp = '1234';

    res.json({
      success: true,
      message: `Verification code sent to +91 ${digits}`,
      phone: `+91 ${digits}`,
      otp: demoOtp
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Authenticate user / login
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res, next) {
  try {
    const { email, phone, password, role, otp } = req.body;
    const identifier = (email || phone || '').trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email or mobile number'
      });
    }

    let user = null;
    const isMongoConnected = User.db?.readyState === 1;

    // 1. Try finding in MongoDB if connected
    if (isMongoConnected) {
      try {
        const query = [];
        if (email) query.push({ email: email.trim().toLowerCase() });
        const digits = cleanPhone(phone || email);
        if (digits) query.push({ phone: { $regex: digits } });

        if (query.length > 0) {
          user = await User.findOne({ $or: query });
        }
      } catch (err) {
        console.warn('⚠️ MongoDB query fallback:', err.message);
      }
    }

    // 2. Try finding in local persistent store
    if (!user) {
      user = findLocalUserByEmailOrPhone(identifier);
    }

    // 3. If password was provided and user exists with password, verify it
    if (user && password) {
      const storedHash = user.passwordHash || user.password;
      if (storedHash) {
        const isValid = verifyPassword(password, storedHash);
        if (!isValid) {
          return res.status(401).json({
            success: false,
            message: 'Incorrect password. Please try again or use OTP.'
          });
        }
      }
    }

    // 4. If user not found, but logging in via OTP (or phone signup flow), auto-register clean profile
    if (!user) {
      const digits = cleanPhone(identifier);
      const generatedName = email
        ? email.split('@')[0]
        : (role === 'Host / Owner' ? 'New Property Host' : 'New Resident');

      const newUserData = {
        id: `usr-${digits || Date.now()}`,
        name: generatedName,
        email: email ? email.trim().toLowerCase() : `user${digits || Date.now()}@homelink.in`,
        phone: digits ? `+91 ${digits}` : '',
        passwordHash: password ? hashPassword(password) : '',
        role: role || 'Renter & Seeker',
        city: 'Rewa, MP',
        ownedPropertyIds: [], // Clean fresh account starts with 0 listings!
        savedProperties: [],
        savedRoommates: [],
        isVerified: true,
        trustLevel: 'Tier 1 Standard',
        memberSince: 'Today'
      };

      // Save to local store
      user = upsertLocalUser(newUserData);

      // Save to MongoDB if connected
      if (isMongoConnected) {
        try {
          const doc = await User.create(newUserData);
          if (doc) user = doc.toObject();
        } catch (err) {
          console.warn('⚠️ MongoDB create fallback note:', err.message);
        }
      }
    }

    const formatted = formatUserResponse(user);
    const token = `hl-token-${formatted.id}`;

    res.json({
      success: true,
      message: `Welcome back, ${formatted.name}!`,
      token,
      accessToken: token,
      user: formatted,
      data: {
        token,
        accessToken: token,
        user: formatted
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res, next) {
  try {
    const { name, email, phone, password, role, city } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: 'Name and at least one contact method (email or phone) are required.'
      });
    }

    const isMongoConnected = User.db?.readyState === 1;
    let existingUser = null;

    // Check if user already exists
    if (isMongoConnected) {
      try {
        const query = [];
        if (email) query.push({ email: email.trim().toLowerCase() });
        const digits = cleanPhone(phone);
        if (digits) query.push({ phone: { $regex: digits } });

        if (query.length > 0) {
          existingUser = await User.findOne({ $or: query });
        }
      } catch (err) {
        console.warn('⚠️ MongoDB check error:', err.message);
      }
    }

    if (!existingUser) {
      existingUser = findLocalUserByEmailOrPhone(email || phone);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email or mobile number. Please log in.'
      });
    }

    const cleanDigits = cleanPhone(phone);
    const newUserData = {
      id: `usr-${cleanDigits || Date.now()}`,
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : `user${cleanDigits || Date.now()}@homelink.in`,
      phone: cleanDigits ? `+91 ${cleanDigits}` : '',
      passwordHash: password ? hashPassword(password) : '',
      role: role || 'Renter & Seeker',
      city: city || 'Rewa, MP',
      ownedPropertyIds: [], // Brand new user has 0 owned properties!
      savedProperties: [],
      savedRoommates: [],
      isVerified: true,
      govtIdApproved: false,
      collegeIdApproved: false,
      trustLevel: 'Tier 1 Standard',
      memberSince: 'Today',
      roommateType: 'looking_for_room',
      roommateStatus: 'looking_for_room'
    };

    // Save to local store
    let createdUser = upsertLocalUser(newUserData);

    // Save to MongoDB if connected
    if (isMongoConnected) {
      try {
        const doc = await User.create(newUserData);
        if (doc) createdUser = doc.toObject();
      } catch (err) {
        console.warn('⚠️ MongoDB register note:', err.message);
      }
    }

    const formatted = formatUserResponse(createdUser);
    const token = `hl-token-${formatted.id}`;

    res.status(201).json({
      success: true,
      message: `Account created successfully. Welcome to HomeLink, ${formatted.name}!`,
      token,
      accessToken: token,
      user: formatted,
      data: {
        token,
        accessToken: token,
        user: formatted
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Public / Authenticated
 */
export async function getMe(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      userId = token.replace('hl-token-', '').replace('rs-jwt-', '');
    }

    let user = null;
    const isMongoConnected = User.db?.readyState === 1;

    if (userId && isMongoConnected) {
      try {
        user = await User.findOne({
          $or: [
            { id: userId },
            { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }
          ]
        });
      } catch (err) {
        console.warn('⚠️ MongoDB getMe note:', err.message);
      }
    }

    if (!user && userId) {
      user = findLocalUserById(userId);
    }

    if (!user) {
      user = findLocalUserByEmailOrPhone('aman.v@gmail.com') || readLocalUsers()[0];
    }

    const formatted = formatUserResponse(user || { name: 'Guest User', role: 'Renter & Seeker' });

    res.json({
      success: true,
      user: formatted,
      data: {
        user: formatted
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Public / Authenticated
 */
export async function updateProfile(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let userId = req.body.id || req.body.userId;

    if (!userId && authHeader && authHeader.startsWith('Bearer ')) {
      userId = authHeader.split(' ')[1].replace('hl-token-', '').replace('rs-jwt-', '');
    }

    const { name, role, city, phone, email, roommateStatus, roommateType } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (city) updateData.city = city;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (roommateStatus) updateData.roommateStatus = roommateStatus;
    if (roommateType) updateData.roommateType = roommateType;

    let user = null;
    const isMongoConnected = User.db?.readyState === 1;

    if (isMongoConnected && userId) {
      try {
        user = await User.findOneAndUpdate(
          { $or: [{ id: userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] },
          updateData,
          { new: true }
        );
      } catch (err) {
        console.warn('⚠️ MongoDB update note:', err.message);
      }
    }

    const updatedLocal = upsertLocalUser({ id: userId, ...updateData });
    const formatted = formatUserResponse(user?.toObject() || updatedLocal);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: formatted,
      data: {
        user: formatted
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get all registered users (for debugging / admin)
 * @route   GET /api/auth/users
 */
export async function getAllUsers(req, res, next) {
  try {
    let users = [];
    if (User.db?.readyState === 1) {
      try {
        const mongoUsers = await User.find().select('-password -passwordHash');
        if (mongoUsers && mongoUsers.length > 0) {
          users = mongoUsers.map(formatUserResponse);
        }
      } catch (err) {
        console.warn('⚠️ MongoDB getAllUsers note:', err.message);
      }
    }

    if (users.length === 0) {
      users = readLocalUsers().map(formatUserResponse);
    }

    res.json({
      success: true,
      count: users.length,
      users,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Logout user
 */
export async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export const getCurrentUser = getMe;

export default {
  sendOtp,
  login,
  register,
  getMe,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  logout,
};

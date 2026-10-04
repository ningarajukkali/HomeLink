import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'usersDb.json');

export function hashPassword(password) {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return password === storedHash; // legacy plain comparison
  }
  const [salt, key] = parts;
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === key;
}

export function cleanPhone(num) {
  if (!num) return '';
  return num.replace(/\D/g, '').slice(-10);
}

const DEFAULT_USERS = [
  {
    id: 'usr-current',
    name: 'Aman Verma',
    email: 'aman.v@gmail.com',
    phone: '+91 9826100001',
    passwordHash: hashPassword('password123'),
    role: 'Renter & Seeker',
    city: 'Rewa, MP',
    isVerified: true,
    govtIdApproved: true,
    collegeIdApproved: true,
    trustLevel: 'Tier 3 Authenticated',
    memberSince: 'Aug 2023',
    ownedPropertyIds: ['prop-1', 'prop-2'],
    savedProperties: ['prop-1', 'prop-2'],
    savedRoommates: ['rm-1'],
    roommateType: 'looking_for_room',
    roommateStatus: 'looking_for_room',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-host-1',
    name: 'Rameshwar Shukla',
    email: 'rameshwar@homelink.in',
    phone: '+91 9826199999',
    passwordHash: hashPassword('password123'),
    role: 'Host / Owner',
    city: 'Rewa, MP',
    isVerified: true,
    govtIdApproved: true,
    trustLevel: 'Verified Host',
    memberSince: 'Jan 2023',
    ownedPropertyIds: ['prop-1', 'prop-2'],
    savedProperties: [],
    savedRoommates: [],
    roommateType: 'looking_for_roommate',
    roommateStatus: 'looking_for_roommate',
    createdAt: new Date().toISOString()
  }
];

export function readLocalUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
      return DEFAULT_USERS;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data) || DEFAULT_USERS;
  } catch (err) {
    console.warn('⚠️ Error reading local users file:', err.message);
    return DEFAULT_USERS;
  }
}

export function saveLocalUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Error saving local users file:', err.message);
  }
}

export function findLocalUserByEmailOrPhone(identifier) {
  if (!identifier) return null;
  const users = readLocalUsers();
  const cleanId = identifier.trim().toLowerCase();
  const cleanDigits = cleanPhone(identifier);

  return users.find(u => {
    if (u.email && u.email.toLowerCase() === cleanId) return true;
    if (cleanDigits && u.phone && cleanPhone(u.phone) === cleanDigits) return true;
    return false;
  }) || null;
}

export function findLocalUserById(id) {
  if (!id) return null;
  const users = readLocalUsers();
  return users.find(u => u.id === id || u._id === id) || null;
}

export function upsertLocalUser(userData) {
  const users = readLocalUsers();
  const existingIdx = users.findIndex(u => {
    if (userData.id && (u.id === userData.id || u._id === userData.id)) return true;
    if (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase()) return true;
    if (userData.phone && cleanPhone(u.phone) === cleanPhone(userData.phone)) return true;
    return false;
  });

  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...userData };
    saveLocalUsers(users);
    return users[existingIdx];
  } else {
    const newUser = {
      id: userData.id || `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      savedProperties: [],
      savedRoommates: [],
      ownedPropertyIds: [],
      isVerified: true,
      trustLevel: 'Tier 1 Standard',
      memberSince: 'Today',
      ...userData
    };
    users.push(newUser);
    saveLocalUsers(users);
    return newUser;
  }
}

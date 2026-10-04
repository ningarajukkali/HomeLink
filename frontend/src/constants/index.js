/**
 * Centralized Application Constants for HomeLink
 */

export const APP_CONFIG = {
  name: 'HomeLink',
  tagline: 'Verified Rentals & Flatmates with 0% Brokerage',
  coverageCities: ['Delhi NCR', 'Bangalore', 'Mumbai', 'Hyderabad', 'Rewa', 'Pune', 'Indore'],
  supportEmail: 'support@homelink.in',
  supportPhone: '1800-HOMELINK',
  primaryColor: '#00A88E',
  secondaryColor: '#006a63'
};

export const ROUTES = {
  WELCOME: 'welcome',
  DASHBOARD: 'dashboard',
  RENTALS: 'rentals',
  RENTAL_FILTERS: 'rental-filters',
  RENTAL_DETAIL: 'rental-detail',
  COMPARE: 'compare',
  LIST_PROPERTY: 'list-property',
  OWNER_DASHBOARD: 'owner-dashboard',
  FEATURED_PLANS: 'featured-plans',
  ROOMMATES: 'roommates',
  ROOMMATE_DETAIL: 'roommate-detail',
  ROOMMATE_REQUESTS: 'roommate-requests',
  CONNECTIONS: 'connections',
  CHAT: 'chat',
  SAVED: 'saved',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  SAFETY: 'safety'
};

export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  PAUSED: 'paused',
  RENTED: 'rented',
  DELETED: 'deleted',
  LOOKING_FOR_ROOM: 'looking_for_room',
  LOOKING_FOR_ROOMMATE: 'looking_for_roommate',
  FOUND_A_ROOM: 'found_a_room',
  ROOMMATE_FOUND: 'roommate_found'
};

export const LOCALITIES_BY_CITY = {
  'Delhi NCR': [
    'GTB Nagar / Hudson Lane',
    'Kamla Nagar (DU North Campus)',
    'Hauz Khas & Green Park',
    'Noida Sector 62',
    'Gurgaon DLF Cyber City'
  ],
  'Bangalore': [
    'Koramangala 4th & 5th Block',
    'HSR Layout Sector 1-4',
    'Indiranagar 100ft Road',
    'BTM Layout',
    'Electronic City & Whitefield'
  ],
  'Mumbai': [
    'Bandra West & Pali Hill',
    'Andheri West & Lokhandwala',
    'Powai Hiranandani',
    'Dadar & Shivaji Park'
  ],
  'Hyderabad': [
    'Gachibowli & Financial District',
    'Madhapur & Hitec City',
    'Kondapur & Botanical Garden',
    'Ameerpet Coaching Hub'
  ],
  'Rewa': [
    'University Area, Rewa (APSU)',
    'Civil Lines, Rewa',
    'SSMC / Hospital Area, Rewa',
    'Bodhaghat Road, Rewa',
    'Kuthulia & Bypass, Rewa'
  ],
  'Other': [
    'Viman Nagar, Pune',
    'Bhawarkua, Indore',
    'Vijay Nagar, Indore'
  ]
};

export const AMENITY_ICONS = {
  'High-speed Wi-Fi': 'wifi',
  '24/7 Power Backup': 'bolt',
  'RO Drinking Water': 'water_drop',
  'Attached Bathroom': 'shower',
  'Two-wheeler Parking': 'two_wheeler',
  'Car & Bike Parking': 'local_parking',
  'Air Cooler Provided': 'ac_unit',
  'Study Desk & Chair': 'desk',
  'Wardrobe': 'inventory_2',
  'CCTV Security': 'videocam',
  '3 Times Home-cooked Meals': 'restaurant',
  'Laundry & Housekeeping': 'local_laundry_service',
  'Lift Access': 'elevator',
  'Geyser Installed': 'hot_tub'
};

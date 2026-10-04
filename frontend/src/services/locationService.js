/**
 * HomeLink Auto-Detect Location & Nearby Places Service
 * Uses HTML5 Geolocation API, OpenStreetMap Reverse Geocoding, and Local Hub Intelligence.
 */

export const CITY_HUBS = {
  'Delhi NCR': {
    id: 'Delhi NCR',
    name: 'Delhi NCR',
    coords: { lat: 28.6139, lng: 77.2090 },
    localities: ['GTB Nagar', 'Hudson Lane', 'Hauz Khas', 'Kamla Nagar', 'Noida', 'Gurgaon'],
    nearbyPlaces: {
      gyms: [
        { name: 'Cult.fit Kamla Nagar', distance: '0.4 km', rating: 4.8, price: '₹1,500/mo', note: 'Group workouts & strength training' },
        { name: 'Anytime Fitness Hudson Lane', distance: '0.2 km', rating: 4.7, price: '₹1,200/mo', note: '24/7 access, student discounts' },
        { name: 'Iron Den Gym GTB Nagar', distance: '0.6 km', rating: 4.5, price: '₹800/mo', note: 'Budget student pass' }
      ],
      barbers: [
        { name: 'Toni&Guy Essentials Hudson Lane', distance: '0.3 km', rating: 4.9, price: '₹250', note: 'Styling & grooming' },
        { name: 'Jawed Habib Hair Xpreso', distance: '0.5 km', rating: 4.6, price: '₹150', note: 'Haircut & beard trim' },
        { name: 'Classic Smart Salon', distance: '0.2 km', rating: 4.4, price: '₹80', note: 'Quick student cuts' }
      ],
      food: [
        { name: 'DU North Campus Homely Tiffin', distance: '0.3 km', rating: 4.8, price: '₹2,200/mo', note: '3 hot homestyle meals daily' },
        { name: 'Hudson Lane Cafe & Student Meals', distance: '0.2 km', rating: 4.7, price: '₹150/thali', note: 'Healthy student thalis' }
      ],
      transit: [
        { name: 'GTB Nagar Metro Station (Yellow Line Gate 2)', distance: '0.3 km', type: 'Metro' },
        { name: 'Vishwa Vidyalaya Metro Station', distance: '0.8 km', type: 'Metro' }
      ]
    }
  },
  'Bangalore': {
    id: 'Bangalore',
    name: 'Bangalore',
    coords: { lat: 12.9716, lng: 77.5946 },
    localities: ['Koramangala', 'HSR Layout', 'Indiranagar', 'BTM Layout', 'Whitefield', 'Electronic City'],
    nearbyPlaces: {
      gyms: [
        { name: 'Cult.fit Koramangala 4th Block', distance: '0.3 km', rating: 4.9, price: '₹1,800/mo', note: 'State-of-the-art gym & boxing' },
        { name: 'Gold\'s Gym 5th Block', distance: '0.8 km', rating: 4.7, price: '₹1,600/mo', note: 'Weight training & cardio' }
      ],
      barbers: [
        { name: 'Bounce Salon & Grooming Koramangala', distance: '0.4 km', rating: 4.8, price: '₹300', note: 'Top rated stylists' },
        { name: 'Truefitt & Hill Indiranagar', distance: '1.2 km', rating: 4.9, price: '₹650', note: 'Luxury grooming' }
      ],
      food: [
        { name: 'Rameshwaram Cafe & South Mess', distance: '0.5 km', rating: 4.8, price: '₹120/meal', note: 'Iconic South Indian food' },
        { name: 'Annapoorna Homely North Indian Mess', distance: '0.3 km', rating: 4.6, price: '₹2,500/mo', note: 'Monthly unlimited tiffin' }
      ],
      transit: [
        { name: 'Koramangala Sony World Bus Hub', distance: '0.2 km', type: 'Bus' },
        { name: 'Indiranagar Purple Line Metro', distance: '1.5 km', type: 'Metro' }
      ]
    }
  },
  'Mumbai': {
    id: 'Mumbai',
    name: 'Mumbai',
    coords: { lat: 19.0760, lng: 72.8777 },
    localities: ['Bandra West', 'Andheri West', 'Powai', 'Dadar', 'Juhu', 'Malad'],
    nearbyPlaces: {
      gyms: [
        { name: 'Gold\'s Gym Pali Hill Bandra', distance: '0.5 km', rating: 4.8, price: '₹2,200/mo', note: 'Celebrity fitness hub' },
        { name: 'Cult.fit Lokhandwala Andheri', distance: '0.6 km', rating: 4.7, price: '₹1,800/mo', note: 'Group functional training' }
      ],
      barbers: [
        { name: 'Juice Salon Bandra', distance: '0.3 km', rating: 4.7, price: '₹350', note: 'Modern haircuts' },
        { name: 'BBLUNT Salon Linking Road', distance: '0.7 km', rating: 4.8, price: '₹450', note: 'Premium salon & spa' }
      ],
      food: [
        { name: 'Mumbai Dabbawala Doorstep Service', distance: '0.1 km', rating: 4.9, price: '₹2,400/mo', note: 'Punctual home-cooked meals' },
        { name: 'Shree Krishna Homely Mess Andheri', distance: '0.4 km', rating: 4.6, price: '₹2,600/mo', note: 'Daily lunch & dinner thali' }
      ],
      transit: [
        { name: 'Bandra Railway Station (Western Line)', distance: '0.6 km', type: 'Train' },
        { name: 'Andheri Metro & Railway Interchange', distance: '0.5 km', type: 'Metro' }
      ]
    }
  },
  'Hyderabad': {
    id: 'Hyderabad',
    name: 'Hyderabad',
    coords: { lat: 17.3850, lng: 78.4867 },
    localities: ['Gachibowli', 'Madhapur', 'Hitec City', 'Kondapur', 'Kukatpally', 'Ameerpet'],
    nearbyPlaces: {
      gyms: [
        { name: 'Cult.fit Financial District Gachibowli', distance: '0.5 km', rating: 4.8, price: '₹1,500/mo', note: 'Modern equipment & HIIT' },
        { name: 'Nitro Fitness Hitec City', distance: '0.7 km', rating: 4.6, price: '₹1,300/mo', note: '24/7 student gym' }
      ],
      barbers: [
        { name: 'Jawed Habib Premium Madhapur', distance: '0.4 km', rating: 4.7, price: '₹180', note: 'Hair & beard grooming' },
        { name: 'The Man Cave Salon Kondapur', distance: '0.8 km', rating: 4.5, price: '₹200', note: 'Specialist men salon' }
      ],
      food: [
        { name: 'Telangana Homestyle Mess Gachibowli', distance: '0.3 km', rating: 4.7, price: '₹2,200/mo', note: 'South & North unlimited thali' },
        { name: 'Swagath Student Biryani & Meals', distance: '0.5 km', rating: 4.6, price: '₹120/meal', note: 'Affordable daily food' }
      ],
      transit: [
        { name: 'Raidurg Metro Station (Blue Line)', distance: '0.6 km', type: 'Metro' },
        { name: 'Hitec City Cyber Towers Bus Stop', distance: '0.4 km', type: 'Bus' }
      ]
    }
  },
  'Rewa': {
    id: 'Rewa',
    name: 'Rewa, MP',
    coords: { lat: 24.5362, lng: 81.3037 },
    localities: ['University Area', 'Civil Lines', 'Bodhaghat Road', 'Kuthulia', 'Dhekaha', 'Sirmour Road'],
    nearbyPlaces: {
      gyms: [
        { name: 'Vindhya Fitness Club APSU Road', distance: '0.3 km', rating: 4.7, price: '₹600/mo', note: 'Student membership, weights & cardio' },
        { name: 'Hercules Power Gym Civil Lines', distance: '0.8 km', rating: 4.6, price: '₹700/mo', note: 'Modern dumbbells & machines' }
      ],
      barbers: [
        { name: 'Smart Cut Family Salon Civil Lines', distance: '0.4 km', rating: 4.7, price: '₹70', note: 'Air-conditioned styling' },
        { name: 'Royal Hair Art University Gate', distance: '0.2 km', rating: 4.5, price: '₹50', note: 'Quick student cuts' }
      ],
      food: [
        { name: 'Shukla Homely Student Mess', distance: '0.2 km', rating: 4.8, price: '₹1,800/mo', note: 'Pure veg nutritious breakfast, lunch & dinner' },
        { name: 'Maa Vaishno Tiffin Service', distance: '0.4 km', rating: 4.7, price: '₹1,900/mo', note: 'Fresh rotis & seasonal veggies' }
      ],
      transit: [
        { name: 'APSU Main Gate Auto Stand', distance: '0.2 km', type: 'Auto' },
        { name: 'Rewa Central Railway Station', distance: '2.5 km', type: 'Train' }
      ]
    }
  },
  'Other': {
    id: 'Other',
    name: 'Pune & Indore',
    coords: { lat: 18.5204, lng: 73.8567 },
    localities: ['Viman Nagar', 'Kothrud', 'Bhawarkua', 'Vijay Nagar'],
    nearbyPlaces: {
      gyms: [
        { name: 'FitHub & Cult.fit Centers', distance: '0.5 km', rating: 4.7, price: '₹1,400/mo', note: 'Strength & functional' }
      ],
      barbers: [
        { name: 'Looks & Cuts Salon', distance: '0.3 km', rating: 4.6, price: '₹150', note: 'Styling & grooming' }
      ],
      food: [
        { name: 'Maa Annapurna Student Mess', distance: '0.3 km', rating: 4.8, price: '₹2,000/mo', note: 'Daily hygienic meals' }
      ],
      transit: [
        { name: 'City BRTS Bus Hub', distance: '0.4 km', type: 'Bus' }
      ]
    }
  }
};

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Finds the closest HomeLink city hub by coordinates
 */
export function findClosestCityHub(lat, lng) {
  let closestCity = 'Delhi NCR';
  let minDistance = Infinity;

  Object.entries(CITY_HUBS).forEach(([cityId, hub]) => {
    const dist = calculateDistanceKm(lat, lng, hub.coords.lat, hub.coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cityId;
    }
  });

  return {
    cityId: closestCity,
    hub: CITY_HUBS[closestCity],
    distanceKm: minDistance
  };
}

/**
 * Auto-detects user GPS location using browser geolocation API & reverse geocodes
 * Returns structured object with detected city, locality, coordinates, and nearby places
 */
export async function detectUserLiveLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng, accuracy } = position.coords;

        // Find nearest supported hub
        const nearest = findClosestCityHub(lat, lng);
        let locality = nearest.hub.localities[0];
        let detectedCityName = nearest.hub.name;
        let formattedAddress = `${locality}, ${detectedCityName}`;

        // Attempt reverse geocoding via OpenStreetMap Nominatim with 3.5s timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
              headers: { 'Accept-Language': 'en' },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const sub = addr.suburb || addr.neighbourhood || addr.residential || addr.road;
            const city = addr.city || addr.town || addr.county || addr.state_district;
            
            if (sub) locality = sub;
            if (city) detectedCityName = city;
            if (data.display_name) {
              const parts = data.display_name.split(',');
              formattedAddress = parts.slice(0, 3).join(',').trim();
            }
          }
        } catch {
          // If network / Nominatim is blocked, fallback seamlessly to nearest hub
        }

        resolve({
          success: true,
          cityId: nearest.cityId,
          cityName: detectedCityName,
          locality,
          formattedAddress,
          coordinates: { lat, lng },
          accuracyMeters: Math.round(accuracy || 10),
          distanceToHubCenter: nearest.distanceKm,
          nearbyPlaces: nearest.hub.nearbyPlaces
        });
      },
      (error) => {
        let msg = 'Failed to retrieve location.';
        if (error.code === 1) msg = 'Location permission was denied. Please allow location access in your browser.';
        else if (error.code === 2) msg = 'Location position unavailable.';
        else if (error.code === 3) msg = 'Location detection timed out.';
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

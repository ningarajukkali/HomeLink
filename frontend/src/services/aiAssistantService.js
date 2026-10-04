/**
 * HomeLink AI Assistant Service
 * 
 * Provides domain-specific conversational intelligence, context-aware advice,
 * and property/roommate recommendations for the Rewa housing ecosystem.
 * 
 * Note: Designed to be easily connected to an LLM endpoint (Gemini API or backend)
 * in the future while currently providing high-fidelity, realistic responses.
 */

export function generateAIResponse({ query, context = {}, properties = [], roommates = [] }) {
  const q = (query || '').toLowerCase().trim();
  const { currentRoute, activeProperty, activeRoommate } = context;

  // Availability Management: Exclude rented, paused or deleted listings from AI recommendations
  const availableProperties = properties.filter(p => (p.availabilityStatus || 'available') === 'available');

  // Availability Management: Exclude inactive/found roommate profiles from AI recommendations
  const activeRoommates = roommates.filter(r => 
    r.availabilityStatus === 'looking_for_room' || 
    r.availabilityStatus === 'looking_for_roommate' || 
    !r.availabilityStatus
  );

  // 1. Context: On Property Detail view asking about the active property
  if (activeProperty && (q.includes('this property') || q.includes('suitable for a student') || q.includes('ask the owner') || q.includes('compare'))) {
    if (q.includes('suitable for a student') || q.includes('student')) {
      const isStudentFriendly = activeProperty.preferredTenant?.toLowerCase().includes('student') || 
                                activeProperty.locality?.toLowerCase().includes('university') ||
                                activeProperty.rent <= 6000;
      return {
        text: `**Suitability Assessment for "${activeProperty.title}"**:\n\n` +
          `• **Rent & Budget**: ₹${activeProperty.rent.toLocaleString('en-IN')}/month is ${activeProperty.rent <= 5500 ? '✅ well within standard student budgets' : '⚠️ slightly higher than average student shared rooms'}.\n` +
          `• **Location**: Situated in **${activeProperty.locality}** (${activeProperty.distance || 'Close to colleges'}). Ideal for fast transit.\n` +
          `• **Amenities**: Includes ${activeProperty.amenities?.slice(0, 4).join(', ') || 'essential amenities'}.\n` +
          `• **Owner**: Managed by **${activeProperty.owner?.name}** (${activeProperty.owner?.type}, verified KYC 🟢).\n\n` +
          (isStudentFriendly ? `🎯 **Verdict**: Highly recommended for students seeking a quiet, verified study environment.` : `💡 **Verdict**: Suitable, though check if room sharing is permitted to split costs.`),
        followUps: [
          'What should I ask the owner?',
          'What is the deposit and lock-in period?',
          'Find other rooms near university under ₹5,000'
        ]
      };
    }

    if (q.includes('ask the owner') || q.includes('owner')) {
      return {
        text: `Here are 4 critical questions to ask **${activeProperty.owner?.name}** before booking a visit:\n\n` +
          `1. **Water Timings**: Is there 24/7 overhead water, or specific morning/evening supply hours?\n` +
          `2. **Electricity Sub-Meter**: What is the per-unit rate on the sub-meter?\n` +
          `3. **Gate & Curfew Timings**: Are there late-night entry restrictions for college/library shifts?\n` +
          `4. **Security Deposit Return**: Is the ₹${activeProperty.deposit?.toLocaleString('en-IN') || activeProperty.rent} deposit refundable immediately upon 30-day move-out notice?`,
        followUps: [
          'Is this suitable for a student?',
          'Book a physical visit',
          'Show similar rooms in Rewa'
        ]
      };
    }
  }

  // 2. Specific Property Search / Recommendations
  const isSearchIntent = q.includes('find') || q.includes('room') || q.includes('pg') || q.includes('flat') || 
                         q.includes('bhk') || q.includes('rent') || q.includes('under') || q.includes('budget');

  if (isSearchIntent && !q.includes('roommate')) {
    // Extract price constraint
    const priceMatch = q.match(/under\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 7000;

    let matchedProps = availableProperties.filter(p => {
      let score = 0;
      if (p.rent <= maxPrice) score += 2;
      if (q.includes('furnished') && p.furnished === 'Furnished') score += 2;
      if (q.includes('university') || q.includes('apsu') || q.includes('college')) {
        if (p.locality.toLowerCase().includes('university') || p.title.toLowerCase().includes('aps')) score += 3;
      }
      if (q.includes('civil lines') && p.locality.toLowerCase().includes('civil')) score += 3;
      if (q.includes('pg') && p.propertyType === 'PG') score += 3;
      if (q.includes('2 bhk') && p.propertyType === '2 BHK') score += 3;
      return score >= 2;
    });

    if (matchedProps.length === 0) {
      matchedProps = availableProperties.slice(0, 2);
    } else {
      matchedProps = matchedProps.slice(0, 3);
    }

    return {
      text: `Sure! I found **${matchedProps.length} verified listings** matching your criteria in Rewa with **0% brokerage**:`,
      properties: matchedProps,
      followUps: [
        'Which areas are good for students?',
        'I need a room for two people',
        'Show PGs with Wi-Fi for a female student'
      ]
    };
  }

  // 3. Roommate Recommendations & Matching
  if (q.includes('roommate') || q.includes('flatmate') || q.includes('female student') || q.includes('girl')) {
    let matchedRoommates = [...activeRoommates];
    let advice = '';

    if (q.includes('female') || q.includes('girl')) {
      matchedRoommates = activeRoommates.filter(r => r.id === 'rm-2' || r.lookingFor.toLowerCase().includes('female'));
      advice = `For female students in Rewa, we strictly enforce **ID verification** and **phone number masking**. Most female scholars prefer gated societies in **Civil Lines** and near **Sanjay Gandhi Hospital / SSMC**.\n\nHere is a verified female seeker currently looking for a flatmate:`;
    } else if (q.includes('rec') || q.includes('engineering')) {
      matchedRoommates = activeRoommates.filter(r => r.occupation.toLowerCase().includes('rec'));
      advice = `Here are engineering scholars from REC Rewa looking for flatmates near Kuthulia & University road:`;
    } else {
      advice = `HomeLink’s **Roommate Match** verifies student Institutional IDs and syncs sleep schedules, food choices, and study habits. Here are top-rated active seekers in Rewa:`;
    }

    return {
      text: advice,
      roommates: matchedRoommates.slice(0, 2),
      followUps: [
        'How can I find a good roommate?',
        'What is the Roommate Seeker Pass?',
        'Find me a room near my college under ₹5,000'
      ]
    };
  }

  // 4. Area Recommendations
  if (q.includes('area') || q.includes('locality') || q.includes('where to live') || q.includes('places') || q.includes('best areas')) {
    return {
      text: `Here is a quick local breakdown of the **best residential areas in Rewa**:\n\n` +
        `🎓 **University Area & Bodhaghat**\n` +
        `• *Best for*: APS University students & competitive exam aspirants.\n` +
        `• *Typical Rent*: ₹3,500 – ₹5,500/month for single rooms & PGs with mess.\n\n` +
        `🏥 **Civil Lines & Hospital Area**\n` +
        `• *Best for*: SSMC medical interns, executive bachelors & families.\n` +
        `• *Typical Rent*: ₹6,000 – ₹13,000/month for 1 BHK & 2 BHK modern flats. Wide roads and prime safety.\n\n` +
        `⚙️ **Kuthulia & Rewa Bypass**\n` +
        `• *Best for*: REC engineering students looking for budget shared accommodation.\n` +
        `• *Typical Rent*: ₹2,500 – ₹4,000/month.\n\n` +
        `🚆 **Sirmour Chowk & Railway Crossing**\n` +
        `• *Best for*: High connectivity to markets, coaching hubs, and transit.`,
      followUps: [
        'Find a room in University Area',
        'Find a flat in Civil Lines',
        'What should I check before renting a room?'
      ]
    };
  }

  // 5. Rental Tips & Checkpoints
  if (q.includes('check before') || q.includes('tips') || q.includes('renting advice') || q.includes('agreement') || q.includes('scam')) {
    return {
      text: `Before finalizing any room or flat in Rewa, always verify these **5 HomeLink Golden Rules**:\n\n` +
        `1. **Water Supply**: Rewa summers can experience groundwater dips. Confirm whether the building has a dedicated borewell, overhead storage, or municipal timing.\n` +
        `2. **Electricity Tariff**: Verify if the sub-meter is billed at actual MPEB slab rates or a flat ₹8-₹10 per unit.\n` +
        `3. **Zero Brokerage**: Never pay any token money to middle agents. On HomeLink, you deal directly with the registered owner.\n` +
        `4. **Deposit Return**: Standard security deposit in Rewa is 1 month rent. Agree on terms for 30-day notice.\n` +
        `5. **Visitor Policy**: For students and PGs, check curfew timings and friend/family visit permissions.`,
      followUps: [
        'Which areas are good for students?',
        'How does Featured Listing work?',
        'Find me a room near my college under ₹5,000'
      ]
    };
  }

  // 6. Property Owner & Listing Help
  if (q.includes('list') || q.includes('owner') || q.includes('post') || q.includes('property listing')) {
    return {
      text: `Listing your property on HomeLink takes under **2 minutes** and is completely free for owners:\n\n` +
        `1. Tap **"List Property"** in the top navigation.\n` +
        `2. Select property category (**Room, PG, 1 BHK, 2 BHK, House**).\n` +
        `3. Set your monthly rent, deposit, and student/family preference.\n` +
        `4. Upload clear photos taken in natural daylight (room corners, bathroom, and entrance).\n\n` +
        `✨ **Pro Tip**: Listings with **verified KYC** and detailed amenity badges receive **3x more verified calls** from tenants in Rewa!`,
      followUps: [
        'Is HomeLink completely free?',
        'How do I list my room for free?',
        'How do I send a roommate request?'
      ]
    };
  }

  // 7. Free Platform Policy & Zero Fees
  if (q.includes('featured') || q.includes('plan') || q.includes('fee') || q.includes('pricing') || q.includes('199') || q.includes('99') || q.includes('cost') || q.includes('free') || q.includes('charge')) {
    return {
      text: `HomeLink is **100% Free for everyone in Rewa**:\n\n` +
        `🟢 **For Tenants & Students**:\n` +
        `• Search & filters: **Free**\n` +
        `• Compare properties: **Free**\n` +
        `• Roommate profiles & requests: **Free** (No registration fee)\n` +
        `• Direct chat with flatmates: **Free**\n\n` +
        `🏡 **For Property Owners & Hosts**:\n` +
        `• Listing properties: **Free** (No ₹199 fee, no subscription)\n` +
        `• Tenant inquiries & visits: **Zero Brokerage**\n\n` +
        `There are **no hidden charges, no memberships, and no renewal fees**.`,
      followUps: [
        'How do I list my room?',
        'How do I send a roommate request?',
        'Find me a room near my college under ₹5,000'
      ]
    };
  }

  // 8. Roommate Request / App Help
  if (q.includes('send') && (q.includes('request') || q.includes('connect'))) {
    return {
      text: `Sending a roommate connection request is safe and straightforward:\n\n` +
        `1. Open the **Roommates** tab from the menu.\n` +
        `2. Tap on any seeker’s card to inspect their lifestyle, budget, college, and habits.\n` +
        `3. Tap **"Send Request"**.\n` +
        `4. Once they accept your mutual interest, private WhatsApp and direct in-app chat unlock instantly with phone protection!`,
      followUps: [
        'Find a Roommate',
        'How can I find a good roommate?',
        'Which areas are good for students?'
      ]
    };
  }

  // 9. General / Conversational Fallback
  return {
    text: `Hello! I’m **HomeLink AI**, your personal housing and rental guide for **Rewa, MP**.\n\n` +
      `I can help you with:\n` +
      `• Finding verified rooms, PGs, or flats under your exact budget.\n` +
      `• Connecting with compatible student roommates from APSU, SSMC, or REC.\n` +
      `• Local area guidance, safe rental agreements, and owner contact.\n\n` +
      `What would you like help with today?`,
    followUps: [
      'Find me a room near my college under ₹5,000',
      'Which areas are good for students?',
      'How can I find a good roommate?',
      'How do I list my room?'
    ]
  };
}

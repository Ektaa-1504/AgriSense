const express = require('express');
const router = express.Router();
const { LivePrice } = require('../models/LivePrice');
const { syncMarketPrices } = require('../services/marketPriceService');
const { getLocationFromCoordinates } = require('../utils/geocoding');

/**
 * GET /api/crop-prices
 * Fetches unique crop prices for the user's region (district first, then state).
 * Data comes from Agmarknet (Official Government API — data.gov.in).
 */
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, state: queryState, crop, limit = 20 } = req.query;

    // 1. Detect user's location — both state AND district for accurate regional prices
    let state = queryState || 'Uttar Pradesh';
    let district = req.query.district || null;

    if (latitude && longitude) {
      const location = await getLocationFromCoordinates(parseFloat(latitude), parseFloat(longitude));
      state = location.state;
      district = location.district;
    }

    console.log(`Fetching regional prices for: ${district ? district + ', ' : ''}${state}`);

    // 2. Get all prices for this state from the database (sorted newest first)
    let prices = await LivePrice.find({ 
      state: new RegExp(state, 'i')
    }).sort({ priceDate: -1 }).limit(500).lean();

    // 3. LIVE SYNC: If fewer than 8 crops, fetch from government API
    // First try district-specific (most local), then state-wide if still low variety
    if (prices.length < 8) {
      console.log(`Only ${prices.length} crops found. Syncing from Agmarknet...`);
      
      // Pass district to get hyper-local prices first (e.g., Meerut district mandis only)
      await syncMarketPrices(state, district);
      
      prices = await LivePrice.find({ 
        state: new RegExp(state, 'i')
      }).sort({ priceDate: -1 }).limit(500).lean();

      // If district sync wasn't enough variety, do a broader state-wide sync too
      if (prices.length < 8) {
        await syncMarketPrices(state); // state-wide, no district filter
        prices = await LivePrice.find({ 
          state: new RegExp(state, 'i')
        }).sort({ priceDate: -1 }).limit(500).lean();
      }
    }

    // 4. FINAL FALLBACK: If state has no data at all, localize national data
    if (prices.length === 0) {
      const nationalData = await LivePrice.find({}).sort({ priceDate: -1 }).limit(20).lean();
      prices = nationalData.map(p => ({ ...p, state, isLive: false }));
    }

    // 5. REGION-FIRST DEDUPLICATION:
    // For each unique crop, we pick the price from the NEAREST MANDI to the user.
    // This uses actual GPS distance so a Meerut user gets Ghaziabad prices (50km),
    // not Lucknow prices (520km).
    const { getDistrictCoordinates, distanceBetween } = require('../utils/districtCoordinates');
    const userLat = latitude ? parseFloat(latitude) : null;
    const userLon = longitude ? parseFloat(longitude) : null;

    const cropBestPrice = new Map(); // crop name → best (nearest) price entry

    for (const price of prices) {
      const cropKey = price.crop.toLowerCase();

      if (!cropBestPrice.has(cropKey)) {
        // First occurrence for this crop — accept it as the starting best
        cropBestPrice.set(cropKey, price);
      } else if (userLat && userLon) {
        // We have the user's GPS — check if this mandi is closer than our current best
        const currentBest = cropBestPrice.get(cropKey);

        // Look up the coordinates of current best's district
        const bestCoords = getDistrictCoordinates(price.state, currentBest.district);
        const thisCoords = getDistrictCoordinates(price.state, price.district);

        if (thisCoords) {
          const thisDistance = distanceBetween(userLat, userLon, thisCoords[0], thisCoords[1]);
          const bestDistance = bestCoords
            ? distanceBetween(userLat, userLon, bestCoords[0], bestCoords[1])
            : Infinity;

          // If this mandi is closer, use it
          if (thisDistance < bestDistance) {
            cropBestPrice.set(cropKey, price);
          }
        }
      }
    }

    // Sort the final list alphabetically for clean display
    let uniquePrices = Array.from(cropBestPrice.values()).sort((a, b) => a.crop.localeCompare(b.crop));

    // 6. Filter by specific crop if the user searched for it
    if (crop) {
      uniquePrices = uniquePrices.filter(p =>
        p.crop.toLowerCase().includes(crop.toLowerCase())
      );
    }

    const result = uniquePrices.slice(0, parseInt(limit));


    res.json({
      success: true,
      query: { state, district: district || 'All Districts' },
      marketSummary: {
        lastUpdated: result[0]?.priceDate || 'N/A',
        totalCrops: result.length
      },
      prices: result
    });

  } catch (error) {
    console.error('Crop Prices Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch market rates' });
  }
});

module.exports = router;
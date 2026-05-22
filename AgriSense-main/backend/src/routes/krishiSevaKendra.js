const express = require('express');
const router = express.Router();
const { KVK } = require('../models/KVK');
const { getStateFromCoordinates } = require('../utils/geocoding');

/**
 * Utility function to calculate distance (in km) between two points
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * GET /api/krishi-seva-kendra
 * Finds the nearest verified agricultural centers (KVKs).
 */
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Location (lat/lon) is required' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // 1. Fetch ALL verified centers from the database. 
    // We store these permanently to keep the app fast and reliable.
    let centers = await KVK.find({}).lean();

    // 2. Calculate the distance for each center from the user
    centers = centers.map(center => ({
      ...center,
      distance: calculateDistance(
        userLat, 
        userLon, 
        center.coordinates.latitude, 
        center.coordinates.longitude
      )
    }));

    // 3. Sort by nearest first
    centers.sort((a, b) => a.distance - b.distance);

    // 4. Determine the detected state for the response header
    const detectedState = await getStateFromCoordinates(userLat, userLon);

    // Respond with the structure expected by the frontend Dashboard.jsx
    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      userLocation: { 
        latitude: userLat, 
        longitude: userLon,
        district: detectedState // Using state/region as the district label
      },
      centers: centers.slice(0, 10) // Show top 10 nearest centers
    });

  } catch (error) {
    console.error('Krishi Seva Kendra Error:', error);
    res.status(500).json({ success: false, message: 'Failed to find nearby centers' });
  }
});

module.exports = router;
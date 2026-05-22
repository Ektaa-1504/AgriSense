const axios = require('axios');

/**
 * Reverse geocodes latitude and longitude into an Indian State using OpenStreetMap Nominatim.
 */
async function getStateFromCoordinates(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                zoom: 10,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'AgriSense-Resume-Application'
            }
        });

        if (response.data && response.data.address) {
            return response.data.address.state || response.data.address.region || 'Unknown';
        }
    } catch (error) {
        console.error('Error reverse geocoding coordinates:', error.message);
    }
    
    return 'Unknown State';
}

/**
 * Returns BOTH state and district for a given coordinate.
 * District helps us show prices from the nearest mandi, not just any mandi in the state.
 */
async function getLocationFromCoordinates(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                zoom: 10,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'AgriSense-Resume-Application'
            }
        });

        if (response.data && response.data.address) {
            const addr = response.data.address;
            return {
                // 'county' is usually the district in Nominatim's India data
                district: addr.county || addr.state_district || addr.city || addr.town || 'Unknown',
                state: addr.state || addr.region || 'Unknown'
            };
        }
    } catch (error) {
        console.error('Error getting full location:', error.message);
    }

    return { state: 'Unknown', district: 'Unknown' };
}

module.exports = { getStateFromCoordinates, getLocationFromCoordinates };

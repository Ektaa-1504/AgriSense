const axios = require('axios');
const { LivePrice } = require('../models/LivePrice');

/**
 * Service to fetch and sync crop prices from the Official Agmarknet Government API (data.gov.in).
 * Resource: "Variety-wise Daily Market Prices Data of Commodity"
 * Source: Ministry of Agriculture and Farmers Welfare, Directorate of Marketing and Inspection
 */
const syncMarketPrices = async (state, district = null) => {
  try {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    
    if (!apiKey || apiKey === 'your_key_here') {
      console.log('Skipping live sync: No Government API Key found in .env');
      return false;
    }

    const target = district ? `${district}, ${state}` : state;
    console.log(`Starting Live Sync from Agmarknet API for: ${target}...`);

    // Correct Resource ID for "Variety-wise Daily Market Prices Data of Commodity"
    // Build the API URL. If district is provided, filter to that specific district first.
    // Agmarknet field names are capitalized: State, District, etc.
    const RESOURCE_ID = '35985678-0d79-46b4-9ed6-6f13308a1d24';
    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&filters[State]=${encodeURIComponent(state)}&limit=100&sort[Arrival_Date]=desc`;
    
    // District filter gives more local prices (e.g., Meerut Mandi wheat instead of Jhansi wheat)
    if (district) {
      url += `&filters[District]=${encodeURIComponent(district)}`;
    }

    const response = await axios.get(url, { timeout: 10000 });
    
    if (!response.data || !response.data.records || response.data.records.length === 0) {
      console.log(`No records returned from API for state: ${state}`);
      return false;
    }

    const records = response.data.records;
    console.log(`✅ Received ${records.length} records from Agmarknet for ${state}.`);

    // Save each record to the database. 
    // We use "upsert" = update if exists, create if not.
    // This keeps the database "Flat" — no duplicate rows piling up over time.
    let savedCount = 0;
    for (const record of records) {
      // Parse the date from the format "DD/MM/YYYY" to "YYYY-MM-DD"
      const [day, month, year] = (record.Arrival_Date || '').split('/');
      const priceDate = year ? `${year}-${month}-${day}` : new Date().toISOString().split('T')[0];

      await LivePrice.findOneAndUpdate(
        { 
          // These three fields uniquely identify ONE price entry
          state: record.State,
          market: record.Market,
          crop: record.Commodity
        },
        {
          // These are the fields we want to update every time
          cropLocal: record.Commodity,
          district: record.District,
          unit: 'Quintal',
          minPrice: parseFloat(record.Min_Price) || 0,
          maxPrice: parseFloat(record.Max_Price) || 0,
          modalPrice: parseFloat(record.Modal_Price) || 0,
          priceDate: priceDate,
          trend: 'stable', // Default trend — can be calculated later
          isLive: true,    // This flag tells us the data is from the official government source
          dataSource: 'Agmarknet (data.gov.in)'
        },
        { upsert: true, new: true } // upsert = update or create
      );
      savedCount++;
    }
    
    console.log(`✅ Saved/Updated ${savedCount} prices for ${state} in the database.`);
    return true;

  } catch (error) {
    // Network error, API down, quota limit, etc.
    console.error(`Government API Sync failed for ${state}:`, error.message);
    return false;
  }
};

module.exports = { syncMarketPrices };

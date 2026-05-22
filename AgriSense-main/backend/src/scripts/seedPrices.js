const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { LivePrice } = require('../models/LivePrice');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const priceData = [
  {
    crop: 'Sugarcane',
    cropLocal: 'गन्ना',
    market: 'Meerut Mandi',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    unit: 'Quintal',
    modalPrice: 350,
    trend: 'stable',
    priceDate: new Date().toISOString().split('T')[0],
    dataSource: 'Agmarknet'
  },
  {
    crop: 'Wheat',
    cropLocal: 'गेहूं',
    market: 'Meerut Market',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    unit: 'Quintal',
    modalPrice: 2450,
    trend: 'up',
    priceDate: new Date().toISOString().split('T')[0],
    dataSource: 'Agmarknet'
  },
  {
    crop: 'Basmati Rice',
    cropLocal: 'ਬਾਸਮਤੀ ਚਾਵਲ',
    market: 'Amritsar APMC',
    district: 'Amritsar',
    state: 'Punjab',
    unit: 'Quintal',
    modalPrice: 4200,
    trend: 'up',
    priceDate: new Date().toISOString().split('T')[0],
    dataSource: 'Agmarknet'
  },
  {
    crop: 'Coconut',
    cropLocal: 'തേങ്ങ',
    market: 'Kochi Market',
    district: 'Ernakulam',
    state: 'Kerala',
    unit: '1000 Nuts',
    modalPrice: 13500,
    trend: 'up',
    priceDate: new Date().toISOString().split('T')[0],
    dataSource: 'Agmarknet'
  },
  {
    crop: 'Onion',
    cropLocal: 'कांदा',
    market: 'Lasalgaon Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    unit: 'Quintal',
    modalPrice: 2150,
    trend: 'down',
    priceDate: new Date().toISOString().split('T')[0],
    dataSource: 'Agmarknet'
  }
];

async function seedPrices() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding prices');

    await LivePrice.deleteMany({});
    console.log('🧹 Cleared old price data');

    await LivePrice.insertMany(priceData);
    console.log(`✅ Seeded ${priceData.length} Legit Market prices successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Price seeding failed:', error);
    process.exit(1);
  }
}

seedPrices();

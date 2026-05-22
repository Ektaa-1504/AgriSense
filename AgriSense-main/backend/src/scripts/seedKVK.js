const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { KVK } = require('../models/KVK');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const kvkData = [
  {
    name: 'Krishi Vigyan Kendra, Meerut',
    nameLocal: 'कृषि विज्ञान केंद्र, मेरठ',
    address: 'Sardar Vallabhbhai Patel University of Agriculture and Technology, Modipuram, Meerut',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250110',
    phone: '0121-2888501',
    email: 'kvkmeerut@gmail.com',
    services: ['Soil Testing', 'Crop Seed Production', 'Dairy Management', 'Horticulture Advisory'],
    coordinates: { latitude: 29.13, longitude: 77.68 },
    officerName: 'Dr. Laxmi Pant'
  },
  {
    name: 'Krishi Vigyan Kendra, Thrissur',
    nameLocal: 'കൃഷി വിജ്ഞാന കേന്ദ്രം, തൃശൂർ',
    address: 'Kerala Agricultural University, Vellanikkara, Thrissur',
    district: 'Thrissur',
    state: 'Kerala',
    pincode: '680656',
    phone: '0487-2371131',
    email: 'kvkthrissur@kau.in',
    services: ['Organic Farming', 'Banana Processing', 'Rice Cultivation Help', 'Pest Control'],
    coordinates: { latitude: 10.54, longitude: 76.28 },
    officerName: 'Dr. Jayakumar G.'
  },
  {
    name: 'Krishi Vigyan Kendra, Amritsar',
    nameLocal: 'ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ, ਅੰਮ੍ਰਿਤਸਰ',
    address: 'Near Nagoke, Amritsar, Punjab',
    district: 'Amritsar',
    state: 'Punjab',
    pincode: '143001',
    phone: '0183-2501151',
    email: 'kvkamritsar@pau.edu',
    services: ['Wheat Seed Quality', 'Stubble Management', 'Farmer Training', 'Paddy Support'],
    coordinates: { latitude: 31.63, longitude: 74.87 },
    officerName: 'Dr. Bikramjit Singh'
  },
  {
    name: 'Krishi Vigyan Kendra, Baramati',
    nameLocal: 'कृषि विज्ञान केंद्र, बारामती',
    address: 'Malegaon Khurd, Baramati, Pune District',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413115',
    phone: '02112-255207',
    email: 'kvkbaramati@yahoo.com',
    services: ['Sugar Cane Advisory', 'Export Quality Grapes', 'Soil Health Card', 'Water Conservation'],
    coordinates: { latitude: 18.15, longitude: 74.58 },
    officerName: 'Dr. Syed Shakir Ali'
  }
];

async function seedKVK() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data (optional, but good for testing)
    await KVK.deleteMany({});
    console.log('🧹 Cleared old KVK data');

    // Add Kisan Call Center to all entries
    const enrichedData = kvkData.map(kvk => ({
      ...kvk,
      services: [...kvk.services, 'Kisan Call Center (1800-180-1551)']
    }));

    await KVK.insertMany(enrichedData);
    console.log(`✅ Seeded ${kvkData.length} Real KVK centers successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedKVK();

/**
 * Approximate centroid coordinates for Indian districts.
 * Used to calculate which mandi is closest to the user for a given crop.
 * Format: { 'State|District': [latitude, longitude] }
 */
const DISTRICT_CENTROIDS = {
  // ─── UTTAR PRADESH ───────────────────────────────────────
  'uttar pradesh|meerut':        [28.98, 77.71],
  'uttar pradesh|ghaziabad':     [28.67, 77.45],
  'uttar pradesh|hapur':         [28.73, 77.78],
  'uttar pradesh|bagpat':        [28.95, 77.22],
  'uttar pradesh|bulandshahr':   [28.40, 77.85],
  'uttar pradesh|shamli':        [29.45, 77.31],
  'uttar pradesh|muzaffarnagar': [29.47, 77.70],
  'uttar pradesh|saharanpur':    [29.97, 77.55],
  'uttar pradesh|bijnor':        [29.37, 78.13],
  'uttar pradesh|moradabad':     [28.84, 78.77],
  'uttar pradesh|amroha':        [28.90, 78.47],
  'uttar pradesh|rampur':        [28.81, 79.02],
  'uttar pradesh|aligarh':       [27.88, 78.08],
  'uttar pradesh|mathura':       [27.49, 77.67],
  'uttar pradesh|agra':          [27.18, 78.02],
  'uttar pradesh|kanpur':        [26.46, 80.33],
  'uttar pradesh|lucknow':       [26.84, 80.94],
  'uttar pradesh|varanasi':      [25.32, 83.01],
  'uttar pradesh|jhansi':        [25.45, 78.57],
  'uttar pradesh|bareilly':      [28.36, 79.43],
  'uttar pradesh|karvi':         [25.15, 80.41],
  'uttar pradesh|kairana':       [29.39, 77.20],
  'uttar pradesh|thanabhavan':   [29.57, 77.43],
  'uttar pradesh|jalalabad':     [29.62, 77.55],
  'uttar pradesh|kopaganj':      [26.00, 83.67],
  'uttar pradesh|maigalganj':    [28.74, 80.18],
  'uttar pradesh|safdarganj':    [27.43, 80.82],
  'uttar pradesh|balrampur':     [27.43, 82.18],
  'uttar pradesh|barabanki':     [26.93, 81.18],
  'uttar pradesh|auraiya':       [26.46, 79.51],
  'uttar pradesh|mahoba':        [25.29, 79.87],
  'uttar pradesh|bahraich':      [27.57, 81.60],
  'uttar pradesh|charra':        [25.62, 79.09],

  // ─── PUNJAB ──────────────────────────────────────────────
  'punjab|ludhiana':  [30.90, 75.81],
  'punjab|amritsar':  [31.63, 74.87],
  'punjab|bathinda':  [30.21, 74.94],
  'punjab|patiala':   [30.33, 76.40],
  'punjab|jalandhar': [31.33, 75.57],

  // ─── HARYANA ──────────────────────────────────────────────
  'haryana|hisar':    [29.15, 75.72],
  'haryana|karnal':   [29.69, 76.99],
  'haryana|gurugram': [28.46, 77.03],
  'haryana|sonipat':  [28.99, 77.02],
  'haryana|rohtak':   [28.89, 76.60],
  'haryana|panipat':  [29.39, 76.97],

  // ─── MAHARASHTRA ─────────────────────────────────────────
  'maharashtra|pune':    [18.52, 73.85],
  'maharashtra|nashik':  [19.99, 73.79],
  'maharashtra|nagpur':  [21.15, 79.08],
  'maharashtra|akola':   [20.71, 77.00],
  'maharashtra|mumbai':  [19.08, 72.88],

  // ─── GUJARAT ─────────────────────────────────────────────
  'gujarat|anand':     [22.56, 72.93],
  'gujarat|junagadh':  [21.52, 70.46],
  'gujarat|rajkot':    [22.30, 70.78],
  'gujarat|surat':     [21.17, 72.83],

  // ─── RAJASTHAN ───────────────────────────────────────────
  'rajasthan|jaipur':  [26.91, 75.80],
  'rajasthan|jodhpur': [26.30, 73.01],
  'rajasthan|udaipur': [24.57, 73.68],
  'rajasthan|ajmer':   [26.45, 74.63],

  // ─── KARNATAKA ───────────────────────────────────────────
  'karnataka|bengaluru': [12.97, 77.59],
  'karnataka|dharwad':   [15.46, 74.99],
  'karnataka|mysuru':    [12.31, 76.64],

  // ─── TAMIL NADU ──────────────────────────────────────────
  'tamil nadu|coimbatore': [11.01, 76.97],
  'tamil nadu|madurai':    [9.93, 78.12],
  'tamil nadu|chennai':    [13.08, 80.27],

  // ─── KERALA ──────────────────────────────────────────────
  'kerala|thrissur':            [10.52, 76.21],
  'kerala|thiruvananthapuram':  [8.52, 76.93],
  'kerala|ernakulam':           [10.01, 76.35],

  // ─── WEST BENGAL ─────────────────────────────────────────
  'west bengal|nadia':            [23.47, 88.55],
  'west bengal|purba medinipur':  [22.32, 87.92],
  'west bengal|kolkata':          [22.57, 88.36],

  // ─── BIHAR ───────────────────────────────────────────────
  'bihar|patna':       [25.59, 85.13],
  'bihar|bhagalpur':   [25.25, 86.97],
  'bihar|muzaffarpur': [26.12, 85.39],

  // ─── MADHYA PRADESH ──────────────────────────────────────
  'madhya pradesh|bhopal':  [23.26, 77.41],
  'madhya pradesh|indore':  [22.72, 75.85],
  'madhya pradesh|gwalior': [26.21, 78.18],

  // ─── ANDHRA PRADESH ──────────────────────────────────────
  'andhra pradesh|guntur':  [16.30, 80.44],
  'andhra pradesh|kurnool': [15.83, 78.05],
};

/**
 * Returns the approximate coordinates of an Indian district.
 * If district is not in our lookup, returns null.
 */
function getDistrictCoordinates(state, district) {
  if (!state || !district) return null;
  const key = `${state.toLowerCase()}|${district.toLowerCase()}`;
  
  // Try exact match first
  if (DISTRICT_CENTROIDS[key]) return DISTRICT_CENTROIDS[key];
  
  // Try partial match (e.g., 'gorakhpur' matches 'gorakhpur')
  for (const [k, v] of Object.entries(DISTRICT_CENTROIDS)) {
    if (k.startsWith(state.toLowerCase()) && k.includes(district.toLowerCase())) {
      return v;
    }
  }
  return null;
}

/**
 * Simple Haversine distance between two lat/lon points (returns km)
 */
function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

module.exports = { getDistrictCoordinates, distanceBetween };

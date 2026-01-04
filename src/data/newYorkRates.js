// New York 2026 SSI/SSP Rate Structure
// Source: NY OTDA - Reflects 2.8% federal COLA increase
// Effective January 1, 2026

export const NY_RATES = {
  single: {
    livingAlone: {
      federal: 994,
      state: 87,
      total: 1081
    },
    livingWithOthers: {
      federal: 994,
      state: 23,
      total: 1017
    },
    householdOfAnother: { // VTR applies
      federal: 662.67,
      state: 23,
      total: 685.67
    },
    // Congregate Care Level 1 - Family Care
    congregate1_metro: { // NYC, Nassau, Rockland, Suffolk, Westchester
      federal: 994,
      state: 266.48,
      total: 1260.48,
      pna: 191 // Personal Needs Allowance
    },
    congregate1_rest: { // Rest of State
      federal: 994,
      state: 228.48,
      total: 1222.48,
      pna: 191
    },
    // Congregate Care Level 2 - Residential Care
    congregate2_metro: {
      federal: 994,
      state: 435,
      total: 1429,
      pna: 219
    },
    congregate2_rest: {
      federal: 994,
      state: 405,
      total: 1399,
      pna: 219
    },
    // Congregate Care Level 3 - Enhanced Residential Care
    congregate3: {
      federal: 994,
      state: 694,
      total: 1688,
      pna: 262
    },
    // Medicaid Facility (Title XIX)
    medicaidFacility: {
      federal: 30,
      state: 0,
      total: 30,
      sspna: 25, // State Supplement PNA for DOH-licensed nursing homes
      sspnaOther: 5 // Other medical facilities
    },
    // No State Supplement categories
    noStateSupplement: {
      federal: 994,
      state: 0,
      total: 994
    }
  },
  couple: {
    livingAlone: {
      federal: 1491,
      state: 104,
      total: 1595
    },
    livingWithOthers: {
      federal: 1491,
      state: 46,
      total: 1537
    },
    householdOfAnother: {
      federal: 994,
      state: 46,
      total: 1040
    },
    congregate1_metro: {
      federal: 1491,
      state: 1029.96,
      total: 2520.96,
      pna: 382
    },
    congregate1_rest: {
      federal: 1491,
      state: 953.96,
      total: 2444.96,
      pna: 382
    },
    congregate2_metro: {
      federal: 1491,
      state: 1367,
      total: 2858,
      pna: 438
    },
    congregate2_rest: {
      federal: 1491,
      state: 1307,
      total: 2798,
      pna: 438
    },
    congregate3: {
      federal: 1491,
      state: 1885,
      total: 3376,
      pna: 524
    }
  }
};

// Metro counties for congregate care rates
export const NY_METRO_COUNTIES = [
  'New York', // NYC (all 5 boroughs)
  'Bronx',
  'Kings', // Brooklyn
  'Queens',
  'Richmond', // Staten Island
  'Nassau',
  'Rockland',
  'Suffolk',
  'Westchester'
];

// Living arrangement labels
export const NY_LIVING_LABELS = {
  livingAlone: 'Living Alone',
  livingWithOthers: 'Living with Others',
  householdOfAnother: 'In Household of Another (VTR)',
  congregate1_metro: 'Family Care (Metro)',
  congregate1_rest: 'Family Care (Rest of State)',
  congregate2_metro: 'Residential Care (Metro)',
  congregate2_rest: 'Residential Care (Rest of State)',
  congregate3: 'Enhanced Residential Care',
  medicaidFacility: 'Medicaid Facility',
  noStateSupplement: 'No State Supplement'
};

// Descriptions for each living arrangement
export const NY_LIVING_DESCRIPTIONS = {
  livingAlone: 'Living independently, alone',
  livingWithOthers: 'Living with others, paying fair share',
  householdOfAnother: 'Living in someone else\'s household receiving free/subsidized room & board',
  congregate1_metro: 'Family Care in NYC, Nassau, Rockland, Suffolk, or Westchester',
  congregate1_rest: 'Family Care outside metro counties',
  congregate2_metro: 'Residential Care in NYC, Nassau, Rockland, Suffolk, or Westchester',
  congregate2_rest: 'Residential Care outside metro counties',
  congregate3: 'Enhanced Residential Care (statewide rate)',
  medicaidFacility: 'Nursing home or medical facility with Medicaid paying 50%+ of care',
  noStateSupplement: 'Private medical facility, small public facility, or emergency shelter'
};

export const NY_RATE_INFO = {
  effectiveDate: '2026-01-01',
  colaIncrease: '2.8%',
  source: 'NY Office of Temporary and Disability Assistance (OTDA)',
  lastVerified: '2025-10-27'
};
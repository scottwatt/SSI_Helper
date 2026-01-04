// State-specific SSI configuration
// 1619(b) thresholds allow Medicaid continuation when earnings exceed SSI limits

export const STATES = {
  CA: {
    code: 'CA',
    name: 'California',
    hasCustomRates: true,
    threshold1619b: 64517,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: true,
    supplementName: 'SSP (State Supplementary Payment)',
    notes: 'Full 2026 SSI/SSP rates (15 categories)'
  },
  NY: {
    code: 'NY',
    name: 'New York',
    hasCustomRates: true,
    threshold1619b: 64017,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: true,
    supplementName: 'SSP',
    notes: 'Full 2026 rates with metro/regional splits'
  },
  MA: {
    code: 'MA',
    name: 'Massachusetts',
    hasCustomRates: true,
    threshold1619b: 52577,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: true,
    supplementName: 'SSP',
    notes: 'Full 2026 rates by category (Aged/Blind/Disabled)'
  },
  HI: {
    code: 'HI',
    name: 'Hawaii',
    hasCustomRates: true,
    threshold1619b: 53082,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: true,
    supplementName: 'State Supplement',
    notes: 'Full 2026 rates (SSA-administered)'
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    hasCustomRates: false,
    threshold1619b: 53501,
    is209b: false,
    medicaidExpanded: false,
    hasStateSupplement: false,
    notes: 'Federal rates only (no state supplement)'
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    hasCustomRates: false,
    threshold1619b: 42119,
    is209b: false,
    medicaidExpanded: false,
    hasStateSupplement: false,
    notes: 'Federal rates only (no state supplement)'
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    hasCustomRates: false,
    threshold1619b: 47472,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: false,
    notes: 'Federal rates only'
  },
  OTHER: {
    code: 'OTHER',
    name: 'Other State',
    hasCustomRates: false,
    threshold1619b: 45000,
    is209b: false,
    medicaidExpanded: true,
    hasStateSupplement: false,
    notes: 'Uses federal SSI rates. Check if your state has a supplement.'
  }
};

// States with full rate implementations
export const IMPLEMENTED_STATES = ['CA', 'NY', 'MA', 'HI'];

// States coming soon
export const COMING_SOON_STATES = ['AK', 'CT', 'NJ', 'VT'];

// Get state by code
export const getState = (code) => STATES[code] || STATES.OTHER;
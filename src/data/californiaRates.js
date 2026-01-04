// California 2026 SSI/SSP Rate Structure
// Source: California Department of Social Services (CDSS)
// Includes Federal SSI + California State Supplementary Payment (SSP)
// Last Updated: January 2026

export const CA_RATES = {
  single: {
    aged: {
      independent: 1233.94,
      noKitchen: 1362.81,
      inHousehold: 907.87,
      nonMedicalCare: 1626.07,
      medicaidFacility: 62.00
    },
    disabled: {
      independent: 1233.94,
      noKitchen: 1362.81,
      inHousehold: 907.87,
      nonMedicalCare: 1626.07,
      medicaidFacility: 62.00
    },
    blind: {
      independent: 1318.32,
      noKitchen: null, // N/A per California rules
      inHousehold: 992.25,
      nonMedicalCare: 1626.07,
      medicaidFacility: 62.00
    },
    minorDisabled: {
      independent: 1091.27,
      inHousehold: 765.20
    }
  },
  couple: {
    bothAgedOrDisabled: {
      independent: 2098.83,
      noKitchen: 2356.57,
      inHousehold: 1609.70,
      nonMedicalCare: 3239.14,
      medicaidFacility: 124.00
    },
    bothBlind: {
      independent: 2324.35,
      inHousehold: 1835.22,
      nonMedicalCare: 3239.14,
      medicaidFacility: 124.00
    },
    mixedBlindAndAgedDisabled: {
      independent: 2238.44,
      inHousehold: 1749.31,
      nonMedicalCare: 3239.14,
      medicaidFacility: 124.00
    }
  }
};

// Labels for UI display
export const CATEGORY_LABELS = {
  aged: 'Aged (65+)',
  disabled: 'Disabled',
  blind: 'Blind',
  minorDisabled: 'Minor with Disability',
  bothAgedOrDisabled: 'Couple (Both Aged/Disabled)',
  bothBlind: 'Couple (Both Blind)',
  mixedBlindAndAgedDisabled: 'Couple (Mixed)'
};

export const LIVING_LABELS = {
  independent: 'Independent Living',
  noKitchen: 'No Cooking Facilities',
  inHousehold: 'In Household of Another',
  nonMedicalCare: 'Non-Medical Care',
  medicaidFacility: 'Medicaid Facility'
};

export const CA_RATE_INFO = {
  effectiveDate: '2026-01-01',
  source: 'California Department of Social Services',
  lastVerified: '2026-01-01'
};
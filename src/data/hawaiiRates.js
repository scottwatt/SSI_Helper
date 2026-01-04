// Hawaii 2026 SSI/SSP Rate Structure
// Source: Hawaii Department of Human Services
// Reflects 2.8% federal COLA increase, effective January 1, 2026
// SSA administers Hawaii state supplement

export const HI_RATES = {
  single: {
    independent: {
      total: 994.00,
      label: 'Independent Living',
      desc: 'Living independently in own residence'
    },
    adultFosterCare: {
      total: 1823.00,
      label: 'Adult Foster Care',
      desc: 'Living in adult foster care home'
    },
    householdOfAnother: {
      total: 662.67,
      label: 'In Household of Another',
      desc: 'Living in someone else\'s household (VTR applies)'
    },
    privateNonMedSmall: {
      total: 1823.00,
      label: 'Private Non-Medical Facility (≤5)',
      desc: 'Private non-medical facility with 5 or fewer residents'
    },
    privateNonMedLarge: {
      total: 1931.00,
      label: 'Private Non-Medical Facility (>5)',
      desc: 'Private non-medical facility with more than 5 residents'
    },
    medicaidFacility: {
      total: 75.00,
      label: 'Medicaid Facility',
      desc: 'Nursing home with Medicaid paying 50%+ of care'
    }
  },
  couple: {
    independent: {
      total: 1491.00,
      label: 'Independent Living',
      desc: 'Living independently in own residence'
    },
    adultFosterCare: {
      total: 3486.00,
      label: 'Adult Foster Care',
      desc: 'Living in adult foster care home'
    },
    householdOfAnother: {
      total: 994.00,
      label: 'In Household of Another',
      desc: 'Living in someone else\'s household (VTR applies)'
    },
    privateNonMedSmall: {
      total: 3486.00,
      label: 'Private Non-Medical Facility (≤5)',
      desc: 'Private non-medical facility with 5 or fewer residents'
    },
    privateNonMedLarge: {
      total: 3702.00,
      label: 'Private Non-Medical Facility (>5)',
      desc: 'Private non-medical facility with more than 5 residents'
    },
    medicaidFacility: {
      total: 150.00,
      label: 'Medicaid Facility',
      desc: 'Nursing home with Medicaid paying 50%+ of care'
    }
  }
};

export const HI_LIVING_ARRANGEMENTS = [
  'independent',
  'adultFosterCare',
  'householdOfAnother',
  'privateNonMedSmall',
  'privateNonMedLarge',
  'medicaidFacility'
];

export const HI_RATE_INFO = {
  effectiveDate: '2026-01-01',
  colaIncrease: '2.8%',
  source: 'Hawaii Department of Human Services',
  lastVerified: '2026-01-01',
  notes: 'SSA administers Hawaii state supplement - single combined payment'
};
// Massachusetts 2026 SSI/SSP Rate Structure
// Source: Mass.gov - State Supplement Program (SSP)
// Effective January 1, 2026

// State Living Arrangements (SLA) mapped to Federal Living Arrangements (FLA)
// SLA A = Full Cost of Living (FLA A)
// SLA B = Shared Expenses (FLA B - VTR with adjustment)
// SLA C = Household of Another (FLA A but living in another's household)
// SLA E = Rest Home (FLA A)
// SLA F = Medicaid Facility (FLA D)
// SLA G = Assisted Living (FLA A)

export const MA_RATES = {
  single: {
    aged: {
      fullCost: { federal: 994.00, state: 128.82, total: 1122.82 },
      sharedExpenses: { federal: 994.00, state: 39.26, total: 1033.26 },
      householdOfAnother: { federal: 662.67, state: 104.36, total: 767.03 },
      restHome: { federal: 994.00, state: 293.00, total: 1287.00 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 994.00, state: 454.00, total: 1448.00 }
    },
    blind: {
      fullCost: { federal: 994.00, state: 149.74, total: 1143.74 },
      sharedExpenses: { federal: 994.00, state: 149.74, total: 1143.74 },
      householdOfAnother: { federal: 662.67, state: 481.07, total: 1143.74 },
      restHome: { federal: 994.00, state: 149.74, total: 1143.74 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 994.00, state: 454.00, total: 1448.00 }
    },
    disabled: {
      fullCost: { federal: 994.00, state: 114.39, total: 1108.39 },
      sharedExpenses: { federal: 994.00, state: 30.40, total: 1024.40 },
      householdOfAnother: { federal: 662.67, state: 87.58, total: 750.25 },
      restHome: { federal: 994.00, state: 293.00, total: 1287.00 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 994.00, state: 454.00, total: 1448.00 }
    }
  },
  // Spouse rates (for eligible couples - each spouse gets half of combined)
  spouse: {
    aged: {
      fullCost: { federal: 745.50, state: 100.86, total: 846.36 },
      sharedExpenses: { federal: 745.50, state: 100.86, total: 846.36 },
      householdOfAnother: { federal: 497.00, state: 107.90, total: 604.90 },
      restHome: { federal: 745.50, state: 541.50, total: 1287.00 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    },
    blind: {
      fullCost: { federal: 745.50, state: 398.24, total: 1143.74 },
      sharedExpenses: { federal: 745.50, state: 398.24, total: 1143.74 },
      householdOfAnother: { federal: 497.00, state: 646.74, total: 1143.74 },
      restHome: { federal: 745.50, state: 398.24, total: 1143.74 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    },
    disabled: {
      fullCost: { federal: 745.50, state: 90.03, total: 835.53 },
      sharedExpenses: { federal: 745.50, state: 90.03, total: 835.53 },
      householdOfAnother: { federal: 497.00, state: 97.09, total: 594.09 },
      restHome: { federal: 745.50, state: 541.50, total: 1287.00 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    }
  },
  // Mixed couple spouse rates (when spouses have different categories)
  mixedSpouse: {
    agedDisabled: { // Aged/Disabled spouse
      fullCost: { federal: 745.50, state: 95.45, total: 840.95 },
      sharedExpenses: { federal: 745.50, state: 95.45, total: 840.95 },
      householdOfAnother: { federal: 497.00, state: 102.50, total: 599.50 },
      restHome: { federal: 745.50, state: 541.50, total: 1287.00 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    },
    agedBlind: { // Aged/Blind spouse
      fullCost: { federal: 745.50, state: 249.55, total: 995.05 },
      sharedExpenses: { federal: 745.50, state: 249.55, total: 995.05 },
      householdOfAnother: { federal: 497.00, state: 377.32, total: 874.33 },
      restHome: { federal: 745.50, state: 469.87, total: 1215.37 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    },
    blindDisabled: { // Blind/Disabled spouse
      fullCost: { federal: 745.50, state: 244.14, total: 989.64 },
      sharedExpenses: { federal: 745.50, state: 244.14, total: 989.64 },
      householdOfAnother: { federal: 497.00, state: 371.92, total: 868.92 },
      restHome: { federal: 745.50, state: 469.87, total: 1215.37 },
      medicaidFacility: { federal: 30.00, state: 42.80, total: 72.80 },
      assistedLiving: { federal: 745.50, state: 340.50, total: 1086.00 }
    }
  }
};

// Labels for living arrangements
export const MA_LIVING_LABELS = {
  fullCost: 'Full Cost of Living',
  sharedExpenses: 'Shared Expenses',
  householdOfAnother: 'Household of Another',
  restHome: 'Rest Home',
  medicaidFacility: 'Medicaid Facility',
  assistedLiving: 'Assisted Living'
};

export const MA_LIVING_DESCRIPTIONS = {
  fullCost: 'Living independently, paying full housing costs (SLA A)',
  sharedExpenses: 'Sharing housing expenses with others (SLA B)',
  householdOfAnother: 'Living in someone else\'s household, receiving support (SLA C)',
  restHome: 'Residing in a licensed rest home (SLA E)',
  medicaidFacility: 'Nursing home with Medicaid paying 50%+ of care (SLA F)',
  assistedLiving: 'Residing in assisted living facility (SLA G)'
};

export const MA_CATEGORY_LABELS = {
  aged: 'Aged (65+)',
  blind: 'Blind',
  disabled: 'Disabled'
};

export const MA_LIVING_ARRANGEMENTS = [
  'fullCost',
  'sharedExpenses',
  'householdOfAnother',
  'restHome',
  'medicaidFacility',
  'assistedLiving'
];

export const MA_RATE_INFO = {
  effectiveDate: '2026-01-01',
  source: 'Massachusetts Department of Transitional Assistance',
  lastVerified: '2025-11-04',
  notes: [
    'MA administers SSP separately from federal SSI since April 2012',
    'SLA B uses VTR adjustment - SSA increases countable income by $331.33 (individual) or $248.50 (spouse)',
    'Blind clients in SLA E are paid at the higher of Blind or Disabled rates',
    'Medicaid Facility: Full federal rate determines MA eligibility, reduced rate determines cash payment'
  ]
};
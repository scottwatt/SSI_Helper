// 2026 Federal SSI Rates
// Source: Social Security Administration
// Last Updated: January 2026

export const FEDERAL_RATES = {
  // Federal Benefit Rate (FBR)
  SSI_FBR: 994,
  SSI_FBR_COUPLE: 1491,

  // Income Exclusions
  GIE: 20,           // General Income Exclusion
  EIE: 65,           // Earned Income Exclusion

  // Student Earned Income Exclusion (SEIE)
  SEIE_MONTHLY: 2410,
  SEIE_ANNUAL: 9730,

  // Substantial Gainful Activity (SGA) Thresholds
  SGA: 1690,
  SGA_BLIND: 2830,

  // Trial Work Period (TWP) Threshold
  TWP: 1210,

  // Resource Limits
  SSI_RESOURCE_IND: 2000,
  SSI_RESOURCE_COUPLE: 3000,

  // Value of One-Third Reduction (VTR)
  // Applied when living in another's household
  VTR: 663,
  VTR_COUPLE: 994,

  // Medicaid Facility Rate
  MEDICAID_FACILITY: 30,
  MEDICAID_FACILITY_COUPLE: 60
};

// Rate effective dates for display/audit purposes
export const RATE_INFO = {
  effectiveDate: '2026-01-01',
  source: 'Social Security Administration',
  lastVerified: '2026-01-01'
};
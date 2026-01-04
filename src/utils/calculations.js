import { FEDERAL_RATES } from '../data/federalRates';
import { CA_RATES } from '../data/californiaRates';
import { STATES } from '../data/states';

/**
 * Get SSI base rate based on state and user selections
 */
export const getSSIBaseRate = (stateCode, category, coupleType, livingArr) => {
  if (stateCode === 'CA') {
    if (category === 'couple') {
      return CA_RATES.couple[coupleType]?.[livingArr] ?? null;
    }
    return CA_RATES.single[category]?.[livingArr] ?? null;
  }

  // Federal rates for other states
  const FED = FEDERAL_RATES;
  
  if (category === 'couple') {
    if (livingArr === 'inHousehold') return FED.VTR_COUPLE;
    if (livingArr === 'medicaidFacility') return FED.MEDICAID_FACILITY_COUPLE;
    return FED.SSI_FBR_COUPLE;
  }
  
  if (livingArr === 'inHousehold') return FED.VTR;
  if (livingArr === 'medicaidFacility') return FED.MEDICAID_FACILITY;
  return FED.SSI_FBR;
};

/**
 * Calculate California SSI payment using WIP-C methodology
 */
export const calculateCaliforniaSSI = (data) => {
  const FED = FEDERAL_RATES;
  const base = getSSIBaseRate('CA', data.category, data.coupleType, data.living);

  // Step 1: Process Unearned Income
  const unearned = data.unearned || 0;
  const gieOnUnearned = Math.min(unearned, FED.GIE);
  const countableUnearned = Math.max(0, unearned - gieOnUnearned);
  const gieRemaining = FED.GIE - gieOnUnearned;

  // Step 2: Process Earned Income
  let earned = data.earned || 0;
  const grossEarned = earned;

  // Student Earned Income Exclusion
  const seie = data.isStudent ? Math.min(earned, FED.SEIE_MONTHLY) : 0;
  earned = Math.max(0, earned - seie);

  // Apply remaining GIE to earned income
  const gieOnEarned = Math.min(earned, gieRemaining);
  earned = Math.max(0, earned - gieOnEarned);

  // Earned Income Exclusion ($65)
  const eie = Math.min(earned, FED.EIE);
  earned = Math.max(0, earned - eie);

  // IRWE (Impairment-Related Work Expenses)
  const irwe = Math.min(earned, data.irwe || 0);
  earned = Math.max(0, earned - irwe);

  // 50% exclusion (divide by 2)
  earned = earned / 2;

  // BWE (Blind Work Expenses) - only for blind individuals
  const bwe = data.category === 'blind' ? Math.min(earned, data.bwe || 0) : 0;
  const countableEarned = Math.max(0, earned - bwe);

  // Step 3: Calculate Total Countable Income
  const passDeduction = Math.min(countableUnearned + countableEarned, data.pass || 0);
  const totalCountable = Math.max(0, countableUnearned + countableEarned - passDeduction);

  // Step 4: Calculate SSI Payment
  const ssiPayment = Math.max(0, base - totalCountable);

  // Step 5: Calculate Total Income
  const totalIncome = ssiPayment + (data.unearned || 0) + (data.earned || 0) 
    - (data.irwe || 0) - (data.bwe || 0) - (data.pass || 0);

  // Check 1619(b) eligibility
  const annualEarnings = (data.earned || 0) * 12;
  const qualifies1619b = ssiPayment === 0 
    && (data.earned || 0) > 0 
    && annualEarnings <= STATES.CA.threshold1619b;

  return {
    base,
    grossEarned,
    countableUnearned,
    countableEarned,
    totalCountable,
    ssiPayment,
    totalIncome,
    gieOnUnearned,
    gieOnEarned,
    eie,
    seie,
    irwe,
    bwe,
    passDeduction,
    qualifies1619b,
    annualEarnings,
    category: data.category,
    coupleType: data.coupleType,
    living: data.living
  };
};

/**
 * Calculate Federal SSI payment (for non-CA states)
 */
export const calculateFederalSSI = (data) => {
  const FED = FEDERAL_RATES;
  
  // Determine base rate
  let base;
  if (data.living === 'couple') {
    base = FED.SSI_FBR_COUPLE;
  } else if (data.living === 'vtr') {
    base = FED.VTR;
  } else {
    base = FED.SSI_FBR;
  }

  // Calculate countable unearned
  const unearned = data.unearned || 0;
  const countableUnearned = Math.max(0, unearned - FED.GIE);

  // Calculate countable earned
  const gieRemaining = Math.max(0, FED.GIE - unearned);
  let earned = Math.max(0, (data.earned || 0) - gieRemaining - FED.EIE - (data.irwe || 0));
  earned = earned / 2;
  earned = Math.max(0, earned - (data.isBlind ? (data.bwe || 0) : 0));

  // Total countable with PASS
  const total = Math.max(0, countableUnearned + earned - (data.pass || 0));

  // SSI Payment
  const ssi = Math.max(0, base - total);

  return {
    base,
    ssi,
    total,
    countableUnearned,
    countableEarned: earned
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format currency without cents
 */
export const formatCurrencyWhole = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
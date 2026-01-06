import { useState, useMemo } from 'react';
import InputField from '../ui/InputField';
import { FEDERAL_RATES } from '../../data/federalRates';
import { STATES } from '../../data/states';

export default function HoursOptimizer({ baseRate = 994, isBlind = false, stateName = 'your state', stateCode = 'OTHER' }) {
  const [hourlyRate, setHourlyRate] = useState('');
  const [irwe, setIrwe] = useState(0);
  const [bwe, setBwe] = useState(0);
  const [unearned, setUnearned] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  
  // Benefits they currently receive
  const [benefits, setBenefits] = useState({
    medicaid: true,
    section8: false,
    section8Amount: 0,
    snap: false,
    snapAmount: 0,
    liheap: false,
    liheapAmount: 0,
    otherBenefits: 0
  });

  const [showBenefits, setShowBenefits] = useState(false);

  const FED = FEDERAL_RATES;
  const state1619b = STATES[stateCode]?.threshold1619b || 45000;

  // Estimate taxes (simplified - federal + state + FICA)
  const estimateTaxes = (annualIncome) => {
    if (annualIncome <= 0) return 0;
    
    // FICA: 7.65%
    const fica = annualIncome * 0.0765;
    
    // Federal income tax (simplified brackets, after standard deduction of ~$14,600)
    const taxableIncome = Math.max(0, annualIncome - 14600);
    let federalTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 11600) {
        federalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 47150) {
        federalTax = 1160 + (taxableIncome - 11600) * 0.12;
      } else {
        federalTax = 5426 + (taxableIncome - 47150) * 0.22;
      }
    }
    
    // State tax estimate (avg ~5% for states with income tax, after similar deduction)
    const stateTax = Math.max(0, (annualIncome - 10000) * 0.05);
    
    return Math.round((fica + federalTax + stateTax) / 12); // Monthly
  };

  // Calculate SSI for a given monthly income
  const calculateSSI = (monthlyEarned) => {
    let earned = monthlyEarned;
    
    const seie = isStudent ? Math.min(earned, FED.SEIE_MONTHLY) : 0;
    earned = Math.max(0, earned - seie);

    const gieOnUnearned = Math.min(unearned, FED.GIE);
    const countableUnearned = Math.max(0, unearned - gieOnUnearned);
    const gieRemaining = FED.GIE - gieOnUnearned;

    earned = Math.max(0, earned - gieRemaining);
    earned = Math.max(0, earned - FED.EIE);
    earned = Math.max(0, earned - irwe);
    earned = earned / 2;
    
    if (isBlind) {
      earned = Math.max(0, earned - bwe);
    }

    const totalCountable = countableUnearned + earned;
    const ssiPayment = Math.max(0, baseRate - totalCountable);
    
    return { ssi: ssiPayment, seie };
  };

  // Estimate benefit impacts
  const estimateBenefitLoss = (monthlyGrossEarned, ssiPayment) => {
    const totalMonthlyIncome = monthlyGrossEarned + unearned + ssiPayment;
    const annualEarnings = monthlyGrossEarned * 12;
    let losses = [];
    let totalLoss = 0;

    // Medicaid - protected under 1619(b) up to threshold
    if (benefits.medicaid) {
      if (ssiPayment > 0) {
        // Still getting SSI = automatic Medicaid
        losses.push({ name: 'Medicaid', status: 'safe', note: 'Protected while receiving SSI' });
      } else if (annualEarnings <= state1619b) {
        // 1619(b) protection
        losses.push({ name: 'Medicaid', status: 'protected', note: `1619(b) protects up to $${(state1619b/1000).toFixed(0)}k/yr` });
      } else {
        // Could lose Medicaid - estimate value at $500/mo
        const medicaidValue = 500;
        losses.push({ name: 'Medicaid', status: 'at-risk', amount: medicaidValue, note: 'May lose coverage - consider Medicaid Buy-In' });
        totalLoss += medicaidValue;
      }
    }

    // Section 8 - typically 30% of income goes to rent
    if (benefits.section8 && benefits.section8Amount > 0) {
      // As income rises, you pay more rent, subsidy decreases
      // Rough: for every $100 earned, you pay ~$30 more rent
      const rentIncrease = Math.round(monthlyGrossEarned * 0.30);
      const actualLoss = Math.min(rentIncrease, benefits.section8Amount);
      if (actualLoss > 0) {
        losses.push({ 
          name: 'Section 8', 
          status: actualLoss >= benefits.section8Amount ? 'at-risk' : 'reduced',
          amount: actualLoss, 
          note: `Rent portion increases ~$${actualLoss}/mo` 
        });
        totalLoss += actualLoss;
      }
    }

    // SNAP - phases out as income increases
    if (benefits.snap && benefits.snapAmount > 0) {
      // SNAP: lose ~$0.24-0.36 for every $1 earned (after deductions)
      // Simplified: lose about 30% of net earnings from SNAP
      const snapReduction = Math.round(monthlyGrossEarned * 0.24);
      const actualLoss = Math.min(snapReduction, benefits.snapAmount);
      if (actualLoss > 0) {
        losses.push({ 
          name: 'SNAP', 
          status: actualLoss >= benefits.snapAmount ? 'at-risk' : 'reduced',
          amount: actualLoss, 
          note: actualLoss >= benefits.snapAmount ? 'May lose entirely' : `Reduced ~$${actualLoss}/mo`
        });
        totalLoss += actualLoss;
      }
    }

    // LIHEAP - typically income-based eligibility
    if (benefits.liheap && benefits.liheapAmount > 0) {
      // Usually tied to 150% FPL (~$22,590/yr for individual)
      const annualTotal = totalMonthlyIncome * 12;
      if (annualTotal > 22590) {
        losses.push({ 
          name: 'LIHEAP', 
          status: 'at-risk', 
          amount: Math.round(benefits.liheapAmount / 12), // Monthly value
          note: 'May exceed income limit' 
        });
        totalLoss += Math.round(benefits.liheapAmount / 12);
      }
    }

    // Other benefits
    if (benefits.otherBenefits > 0 && monthlyGrossEarned > 500) {
      // Assume other benefits phase out gradually
      const otherLoss = Math.min(benefits.otherBenefits, Math.round(monthlyGrossEarned * 0.15));
      if (otherLoss > 0) {
        losses.push({ name: 'Other Programs', status: 'reduced', amount: otherLoss });
        totalLoss += otherLoss;
      }
    }

    return { losses, totalLoss };
  };

  // Generate scenarios
  const scenarios = useMemo(() => {
    if (!hourlyRate || hourlyRate <= 0) return [];
    
    const results = [];
    const weeksPerMonth = 4.33;
    
    for (let hours = 0; hours <= 40; hours += 5) {
      const monthlyGross = Math.round(hours * weeksPerMonth * hourlyRate);
      const annualGross = monthlyGross * 12;
      const taxes = estimateTaxes(annualGross);
      const calc = calculateSSI(monthlyGross);
      const benefitImpact = estimateBenefitLoss(monthlyGross, calc.ssi);
      
      const monthlyNet = monthlyGross - taxes;
      const totalBeforeLosses = monthlyNet + calc.ssi + unearned;
      const realTotal = totalBeforeLosses - benefitImpact.totalLoss;
      
      // Compare to baseline (0 hours)
      const baseline = hours === 0 ? 0 : results[0]?.realTotal || (baseRate + unearned);
      const netGain = realTotal - baseline;
      
      results.push({
        hours,
        monthlyGross,
        taxes,
        monthlyNet,
        ssi: calc.ssi,
        benefitLoss: benefitImpact.totalLoss,
        benefitDetails: benefitImpact.losses,
        totalBeforeLosses,
        realTotal,
        netGain,
        annualEarnings: annualGross,
        protected1619b: annualGross <= state1619b
      });
    }
    
    return results;
  }, [hourlyRate, baseRate, irwe, bwe, unearned, isStudent, isBlind, benefits, state1619b]);

  // Find best scenario (highest real total)
  const bestScenario = useMemo(() => {
    if (scenarios.length < 2) return null;
    return scenarios.reduce((best, curr) => 
      curr.realTotal > best.realTotal ? curr : best
    );
  }, [scenarios]);

  // Find safe maximum (keeps SSI + Medicaid safe)
  const safeMax = useMemo(() => {
    if (scenarios.length < 2) return null;
    const safe = scenarios.filter(s => s.ssi > 0 && s.hours > 0);
    if (safe.length === 0) return null;
    return safe.reduce((best, curr) => 
      curr.realTotal > best.realTotal ? curr : best
    );
  }, [scenarios]);

  // Cliff warning - where you actually lose money by working more
  const cliffPoints = useMemo(() => {
    const cliffs = [];
    for (let i = 1; i < scenarios.length; i++) {
      if (scenarios[i].realTotal < scenarios[i-1].realTotal) {
        cliffs.push({
          from: scenarios[i-1].hours,
          to: scenarios[i].hours,
          loss: scenarios[i-1].realTotal - scenarios[i].realTotal
        });
      }
    }
    return cliffs;
  }, [scenarios]);

  const sgaThreshold = isBlind ? FED.SGA_BLIND : FED.SGA;

  const updateBenefit = (key, value) => {
    setBenefits(b => ({ ...b, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <h2 className="text-lg font-bold text-gray-900">Work Impact Calculator</h2>
        <p className="text-sm text-gray-500">See the REAL effect of working</p>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <InputField
          label="Your Hourly Wage"
          hint="Before taxes"
          value={hourlyRate}
          onChange={setHourlyRate}
          placeholder="15.00"
        />
        
        <InputField
          label="Monthly Unearned Income"
          hint="SSDI, VA, pensions, etc."
          value={unearned}
          onChange={setUnearned}
        />

        {/* Current Benefits Section */}
        <div className="bg-purple-50 rounded-xl border border-purple-200 overflow-hidden">
          <button 
            onClick={() => setShowBenefits(!showBenefits)}
            className="w-full p-3 text-left font-medium text-purple-900 flex justify-between items-center"
          >
            <span>🛡️ Benefits I Currently Receive</span>
            <span className="text-purple-500">{showBenefits ? '▼' : '▶'}</span>
          </button>
          
          {showBenefits && (
            <div className="p-3 pt-0 space-y-3 border-t border-purple-200">
              <p className="text-xs text-purple-700">Check all that apply - this helps calculate your TRUE income</p>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={benefits.medicaid} onChange={e => updateBenefit('medicaid', e.target.checked)} className="accent-purple-600" />
                <span className="text-sm">Medicaid / Medi-Cal</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={benefits.section8} onChange={e => updateBenefit('section8', e.target.checked)} className="accent-purple-600" />
                  <span className="text-sm">Section 8 / Housing Voucher</span>
                </label>
                {benefits.section8 && (
                  <InputField
                    label="Monthly housing subsidy value"
                    hint="How much does the voucher cover?"
                    value={benefits.section8Amount}
                    onChange={v => updateBenefit('section8Amount', v)}
                    placeholder="800"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={benefits.snap} onChange={e => updateBenefit('snap', e.target.checked)} className="accent-purple-600" />
                  <span className="text-sm">SNAP / Food Stamps</span>
                </label>
                {benefits.snap && (
                  <InputField
                    label="Monthly SNAP amount"
                    value={benefits.snapAmount}
                    onChange={v => updateBenefit('snapAmount', v)}
                    placeholder="200"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={benefits.liheap} onChange={e => updateBenefit('liheap', e.target.checked)} className="accent-purple-600" />
                  <span className="text-sm">LIHEAP (utility assistance)</span>
                </label>
                {benefits.liheap && (
                  <InputField
                    label="Annual LIHEAP amount"
                    value={benefits.liheapAmount}
                    onChange={v => updateBenefit('liheapAmount', v)}
                    placeholder="500"
                  />
                )}
              </div>

              <InputField
                label="Other monthly benefits"
                hint="Phone program, transit, food bank value, etc."
                value={benefits.otherBenefits}
                onChange={v => updateBenefit('otherBenefits', v)}
                placeholder="50"
              />
            </div>
          )}
        </div>

        {/* Work Incentives */}
        <details className="bg-gray-50 rounded-xl border border-gray-200">
          <summary className="p-3 font-medium cursor-pointer text-gray-700">
            Work Incentive Deductions
          </summary>
          <div className="p-3 pt-0 space-y-3 border-t border-gray-200 mt-2">
            <InputField label="Monthly IRWE" hint="Disability-related work expenses" value={irwe} onChange={setIrwe} />
            {isBlind && <InputField label="Monthly BWE" hint="Blind work expenses" value={bwe} onChange={setBwe} />}
            <label className="flex items-center gap-2 p-2 bg-white rounded-lg">
              <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="accent-blue-600" />
              <span className="text-sm">Student under 22 (SEIE applies)</span>
            </label>
          </div>
        </details>
      </div>

      {/* Results */}
      {scenarios.length > 0 && (
        <>
          {/* Cliff Warning */}
          {cliffPoints.length > 0 && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
              <div className="font-bold text-red-800 flex items-center gap-2">
                🚨 Benefits Cliff Detected!
              </div>
              {cliffPoints.map((cliff, i) => (
                <p key={i} className="text-sm text-red-700 mt-1">
                  Working {cliff.to} hrs instead of {cliff.from} hrs actually <strong>loses</strong> you ${cliff.loss.toFixed(0)}/month!
                </p>
              ))}
            </div>
          )}

          {/* Best Overall */}
          {bestScenario && (
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
              <div className="text-sm opacity-90 font-medium">💰 Best Total Income</div>
              <div className="text-3xl font-bold my-1">{bestScenario.hours} hrs/week</div>
              <div className="text-emerald-100">
                Real monthly income: <strong>${bestScenario.realTotal.toFixed(0)}</strong>
              </div>
              <div className="mt-2 text-xs opacity-80 space-y-0.5">
                <div>Wages after tax: ${bestScenario.monthlyNet.toFixed(0)} + SSI: ${bestScenario.ssi.toFixed(0)}</div>
                {bestScenario.benefitLoss > 0 && (
                  <div className="text-yellow-200">– Benefit reductions: ${bestScenario.benefitLoss.toFixed(0)}</div>
                )}
              </div>
            </div>
          )}

          {/* Safe Maximum */}
          {safeMax && safeMax.hours !== bestScenario?.hours && (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="font-semibold text-blue-900">🛡️ Safe Maximum (keeps SSI)</div>
              <div className="text-2xl font-bold text-blue-800">{safeMax.hours} hrs/week</div>
              <p className="text-sm text-blue-700 mt-1">
                ${safeMax.realTotal.toFixed(0)}/mo total • SSI stays at ${safeMax.ssi.toFixed(0)}/mo
              </p>
              {benefits.medicaid && (
                <p className="text-xs text-blue-600 mt-1">✓ Medicaid protected while receiving SSI</p>
              )}
            </div>
          )}

          {/* Detailed Comparison Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-2 py-2 border-b border-gray-200">
              <div className="grid grid-cols-6 text-xs font-semibold text-gray-600 text-center">
                <div>Hrs</div>
                <div>Gross</div>
                <div>Tax</div>
                <div>SSI</div>
                <div>Loss</div>
                <div>Real$</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {scenarios.map((s) => {
                const isBest = bestScenario && s.hours === bestScenario.hours;
                const isSafe = safeMax && s.hours === safeMax.hours;
                const hasCliff = cliffPoints.some(c => c.to === s.hours);
                const isOverSGA = s.monthlyGross > sgaThreshold;
                
                return (
                  <div 
                    key={s.hours}
                    className={`grid grid-cols-6 px-2 py-2 text-xs text-center ${
                      isBest ? 'bg-emerald-50 font-semibold' : 
                      isSafe ? 'bg-blue-50' :
                      hasCliff ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      {s.hours}
                      {isBest && <span className="text-emerald-600">★</span>}
                      {isSafe && !isBest && <span className="text-blue-600">●</span>}
                      {hasCliff && <span className="text-red-600">⚠</span>}
                    </div>
                    <div>${s.monthlyGross}</div>
                    <div className="text-gray-400">-${s.taxes}</div>
                    <div className={s.ssi === 0 ? 'text-red-500' : 'text-emerald-600'}>
                      ${s.ssi.toFixed(0)}
                    </div>
                    <div className={s.benefitLoss > 0 ? 'text-amber-600' : 'text-gray-300'}>
                      {s.benefitLoss > 0 ? `-$${s.benefitLoss.toFixed(0)}` : '-'}
                    </div>
                    <div className={`font-medium ${hasCliff ? 'text-red-600' : ''}`}>
                      ${s.realTotal.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <span><span className="text-emerald-600">★</span> Best income</span>
            <span><span className="text-blue-600">●</span> Safe max</span>
            <span><span className="text-red-600">⚠</span> Cliff</span>
          </div>

          {/* Benefit Details for Best Scenario */}
          {bestScenario && bestScenario.benefitDetails.length > 0 && (
            <details className="bg-amber-50 rounded-xl border border-amber-200">
              <summary className="p-3 font-medium cursor-pointer text-amber-900">
                Benefit Impact Details at {bestScenario.hours} hrs/week
              </summary>
              <div className="p-3 pt-0 space-y-2 border-t border-amber-200 mt-2">
                {bestScenario.benefitDetails.map((b, i) => (
                  <div key={i} className={`p-2 rounded-lg text-sm ${
                    b.status === 'safe' ? 'bg-green-100 text-green-800' :
                    b.status === 'protected' ? 'bg-blue-100 text-blue-800' :
                    b.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    <div className="font-medium">{b.name}: {b.status.toUpperCase()}</div>
                    <div className="text-xs">{b.note}</div>
                    {b.amount && <div className="text-xs font-medium">-${b.amount}/mo</div>}
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* 1619(b) Info */}
          {scenarios.some(s => !s.protected1619b) && benefits.medicaid && (
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-sm">
              <div className="font-semibold text-purple-800">📋 1619(b) Medicaid Protection</div>
              <p className="text-purple-700 text-xs mt-1">
                In {stateName}, you can keep Medicaid if annual earnings stay under ${state1619b.toLocaleString()}, 
                even when SSI goes to $0. This is crucial protection!
              </p>
            </div>
          )}

          {/* SGA Warning */}
          {scenarios.some(s => s.monthlyGross > sgaThreshold) && (
            <div className="bg-gray-100 p-3 rounded-xl text-sm">
              <div className="font-semibold text-gray-800">⚠️ SGA Note</div>
              <p className="text-gray-600 text-xs mt-1">
                Earnings over ${sgaThreshold}/mo may trigger a disability review. 
                This doesn't automatically end benefits, but SSA may evaluate your case.
              </p>
            </div>
          )}
        </>
      )}

      {!hourlyRate && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">⏰</div>
          Enter your hourly wage to see how work affects your total income
        </div>
      )}

      <div className="bg-gray-100 p-3 rounded-xl text-xs text-gray-600">
        <strong>Important:</strong> These are estimates. Benefit impacts vary by your specific situation, 
        local rules, and timing. Tax estimates assume single filer. Always verify with your benefits 
        counselor or case worker before making decisions. Uses 4.33 weeks/month.
      </div>
    </div>
  );
}
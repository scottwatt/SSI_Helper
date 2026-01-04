import { useState, useCallback } from 'react';
import RadioOption from '../ui/RadioOption';
import InputField from '../ui/InputField';
import { FEDERAL_RATES } from '../../data/federalRates';
import { MA_RATES, MA_LIVING_LABELS, MA_LIVING_DESCRIPTIONS, MA_CATEGORY_LABELS, MA_LIVING_ARRANGEMENTS } from '../../data/massachusettsRates';
import { STATES } from '../../data/states';

export default function MassachusettsCalculator() {
  const [data, setData] = useState({});
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(0);

  const updateData = useCallback((updates) => {
    setData(d => ({ ...d, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setData({});
    setResults(null);
  }, []);

  const getRateData = () => {
    if (data.household === 'single') {
      return MA_RATES.single[data.category]?.[data.living];
    } else if (data.household === 'couple') {
      if (data.coupleType === 'same') {
        return MA_RATES.spouse[data.category]?.[data.living];
      } else {
        return MA_RATES.mixedSpouse[data.mixedType]?.[data.living];
      }
    }
    return null;
  };

  const calculate = () => {
    const FED = FEDERAL_RATES;
    const rateData = getRateData();
    if (!rateData) return;
    
    const base = rateData.total;
    const isCouple = data.household === 'couple';

    // Process Unearned Income
    const unearned = data.unearned || 0;
    const gieOnUnearned = Math.min(unearned, FED.GIE);
    const countableUnearned = Math.max(0, unearned - gieOnUnearned);
    const gieRemaining = FED.GIE - gieOnUnearned;

    // Process Earned Income
    let earned = data.earned || 0;
    const grossEarned = earned;
    const seie = data.isStudent ? Math.min(earned, FED.SEIE_MONTHLY) : 0;
    earned = Math.max(0, earned - seie);
    const gieOnEarned = Math.min(earned, gieRemaining);
    earned = Math.max(0, earned - gieOnEarned);
    const eie = Math.min(earned, FED.EIE);
    earned = Math.max(0, earned - eie);
    const irwe = Math.min(earned, data.irwe || 0);
    earned = Math.max(0, earned - irwe);
    earned = earned / 2;
    const bwe = data.category === 'blind' ? Math.min(earned, data.bwe || 0) : 0;
    const countableEarned = Math.max(0, earned - bwe);

    // Total Countable Income
    const passDeduction = Math.min(countableUnearned + countableEarned, data.pass || 0);
    const totalCountable = Math.max(0, countableUnearned + countableEarned - passDeduction);

    // Calculate payment
    const ssiPayment = Math.max(0, base - totalCountable);
    
    // For couples, this is per-spouse amount
    const coupleNote = isCouple ? ' (per spouse)' : '';
    const totalIncome = ssiPayment + (data.unearned || 0) + grossEarned - (data.irwe || 0) - (data.bwe || 0) - (data.pass || 0);

    // 1619(b) check
    const annualEarnings = grossEarned * 12;
    const qualifies1619b = ssiPayment === 0 && grossEarned > 0 && annualEarnings <= STATES.MA.threshold1619b;

    setResults({
      base,
      federal: rateData.federal,
      state: rateData.state,
      grossEarned,
      countableUnearned,
      countableEarned,
      totalCountable,
      ssiPayment,
      totalIncome,
      gieOnUnearned,
      eie,
      seie,
      irwe,
      bwe,
      passDeduction,
      qualifies1619b,
      annualEarnings,
      living: data.living,
      category: data.category,
      household: data.household,
      coupleNote,
      isCouple
    });
  };

  const getActiveStep = () => {
    if (!data.household) return 0;
    if (!data.category && data.household === 'single') return 1;
    if (data.household === 'couple' && !data.coupleType) return 1;
    if (data.household === 'couple' && data.coupleType === 'same' && !data.category) return 1;
    if (data.household === 'couple' && data.coupleType === 'mixed' && !data.mixedType) return 1;
    if (!data.living) return 2;
    if (step <= 3) return 3;
    return 4;
  };

  const activeStep = results ? -1 : getActiveStep();

  const canContinue = () => {
    if (activeStep === 0) return !!data.household;
    if (activeStep === 1) {
      if (data.household === 'single') return !!data.category;
      if (data.coupleType === 'same') return !!data.category;
      if (data.coupleType === 'mixed') return !!data.mixedType;
      return !!data.coupleType;
    }
    if (activeStep === 2) return !!data.living;
    return true;
  };

  const handleBack = () => {
    if (activeStep === 1) updateData({ household: null, category: null, coupleType: null, mixedType: null, living: null });
    else if (activeStep === 2) updateData({ category: null, coupleType: null, mixedType: null, living: null });
    else if (activeStep === 3) updateData({ living: null });
    else setStep(step - 1);
  };

  const handleNext = () => {
    if (activeStep < 4) setStep(step + 1);
    else calculate();
  };

  // Results View
  if (results) {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl shadow-lg">
          <p className="text-sm opacity-90 font-medium">Estimated Massachusetts SSI/SSP Payment{results.coupleNote}</p>
          <p className="text-5xl font-bold my-2">${results.ssiPayment.toFixed(2)}<span className="text-lg font-normal">/mo</span></p>
          {results.isCouple && <p className="text-blue-200 text-xs">Each spouse receives this amount</p>}
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="font-semibold text-blue-900">Rate Breakdown</div>
          <p className="text-blue-700 text-sm">{MA_CATEGORY_LABELS[results.category] || 'Mixed Couple'} • {MA_LIVING_LABELS[results.living]}</p>
          <div className="mt-2 text-sm space-y-1">
            <div className="flex justify-between"><span>Federal SSI:</span><span>${results.federal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>MA State Supplement:</span><span>${results.state.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t border-blue-200 pt-1"><span>Base Rate:</span><span>${results.base.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-sm text-purple-800">
          <strong>Note:</strong> In MA, you receive two separate payments - federal SSI from SSA and state SSP from the Commonwealth.
        </div>

        <details className="bg-gray-50 rounded-xl border border-gray-200">
          <summary className="p-4 font-semibold cursor-pointer text-gray-800">View Calculation Details</summary>
          <div className="p-4 pt-0 text-sm space-y-2 border-t border-gray-200 mt-2">
            <div className="flex justify-between"><span>Gross Unearned</span><span>${data.unearned || 0}</span></div>
            <div className="flex justify-between text-gray-500"><span>– GIE</span><span>-${results.gieOnUnearned}</span></div>
            <div className="flex justify-between font-medium"><span>Countable Unearned</span><span>${results.countableUnearned.toFixed(2)}</span></div>
            {(data.earned || 0) > 0 && (
              <>
                <div className="border-t pt-2 mt-2"></div>
                <div className="flex justify-between"><span>Gross Earned</span><span>${data.earned}</span></div>
                {results.seie > 0 && <div className="flex justify-between text-gray-500"><span>– SEIE</span><span>-${results.seie}</span></div>}
                <div className="flex justify-between text-gray-500"><span>– EIE</span><span>-${results.eie}</span></div>
                {results.irwe > 0 && <div className="flex justify-between text-gray-500"><span>– IRWE</span><span>-${results.irwe}</span></div>}
                <div className="flex justify-between font-medium"><span>Countable Earned</span><span>${results.countableEarned.toFixed(2)}</span></div>
              </>
            )}
            <div className="border-t pt-2 mt-2"></div>
            <div className="flex justify-between"><span>Total Countable</span><span>${results.totalCountable.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-emerald-700 border-t pt-2"><span>SSI/SSP Payment</span><span>${results.ssiPayment.toFixed(2)}</span></div>
          </div>
        </details>

        {results.qualifies1619b && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
            <p className="font-semibold text-purple-800">✓ 1619(b) Medicaid Protection May Apply</p>
            <p className="text-purple-600 text-xs">Annual earnings (${results.annualEarnings.toLocaleString()}) below MA threshold</p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
          <strong>Reminder:</strong> This is an estimate. Actual payments determined by SSA and MA DTA.
        </div>

        <button onClick={reset} className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors">Start Over</button>
      </div>
    );
  }

  // Get current rates for display
  const getCurrentRates = () => {
    if (data.household === 'single' && data.category) {
      return MA_RATES.single[data.category];
    } else if (data.household === 'couple') {
      if (data.coupleType === 'same' && data.category) {
        return MA_RATES.spouse[data.category];
      } else if (data.coupleType === 'mixed' && data.mixedType) {
        return MA_RATES.mixedSpouse[data.mixedType];
      }
    }
    return null;
  };

  // Questions
  const questions = [
    {
      title: 'Household Type',
      content: (
        <div className="space-y-3">
          <RadioOption value="single" current={data.household} onChange={v => updateData({ household: v, category: null, coupleType: null, mixedType: null, living: null })} label="Individual" desc="Single SSI recipient" />
          <RadioOption value="couple" current={data.household} onChange={v => updateData({ household: v, category: null, coupleType: null, mixedType: null, living: null })} label="Eligible Couple" desc="Both spouses receive SSI" />
        </div>
      )
    },
    {
      title: data.household === 'couple' ? 'Couple Category' : 'Eligibility Category',
      content: (
        <div className="space-y-3">
          {data.household === 'single' ? (
            <>
              <RadioOption value="aged" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Aged (65+)" desc="Age 65 or older" />
              <RadioOption value="blind" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Blind" desc="Meet SSA statutory blindness criteria" />
              <RadioOption value="disabled" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Disabled" desc="Have a qualifying disability" />
            </>
          ) : !data.coupleType ? (
            <>
              <p className="text-sm text-gray-600">Are both spouses in the same category?</p>
              <RadioOption value="same" current={data.coupleType} onChange={v => updateData({ coupleType: v, category: null, mixedType: null })} label="Same Category" desc="Both spouses are Aged, both Blind, or both Disabled" />
              <RadioOption value="mixed" current={data.coupleType} onChange={v => updateData({ coupleType: v, category: null, mixedType: null })} label="Mixed Categories" desc="Spouses have different eligibility categories" />
            </>
          ) : data.coupleType === 'same' ? (
            <>
              <p className="text-sm text-gray-600">Select the category for both spouses:</p>
              <RadioOption value="aged" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Both Aged (65+)" />
              <RadioOption value="blind" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Both Blind" />
              <RadioOption value="disabled" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Both Disabled" />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">Select the mixed category combination:</p>
              <RadioOption value="agedDisabled" current={data.mixedType} onChange={v => updateData({ mixedType: v, living: null })} label="Aged + Disabled" desc="One spouse aged, one disabled" />
              <RadioOption value="agedBlind" current={data.mixedType} onChange={v => updateData({ mixedType: v, living: null })} label="Aged + Blind" desc="One spouse aged, one blind" />
              <RadioOption value="blindDisabled" current={data.mixedType} onChange={v => updateData({ mixedType: v, living: null })} label="Blind + Disabled" desc="One spouse blind, one disabled" />
            </>
          )}
        </div>
      )
    },
    {
      title: 'Living Arrangement',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-2">Select your living situation in Massachusetts.</p>
          {(() => {
            const rates = getCurrentRates();
            if (!rates) return <p>Please complete previous steps first.</p>;
            return MA_LIVING_ARRANGEMENTS.map(key => (
              <RadioOption
                key={key}
                value={key}
                current={data.living}
                onChange={v => updateData({ living: v })}
                label={MA_LIVING_LABELS[key]}
                desc={MA_LIVING_DESCRIPTIONS[key]}
                rate={`$${rates[key].total.toFixed(2)}`}
              />
            ));
          })()}
        </div>
      )
    },
    {
      title: 'Monthly Income',
      content: (
        <div className="space-y-4">
          <InputField label="Unearned Income" hint="SSDI, VA benefits, pensions, etc. (First $20 excluded)" value={data.unearned} onChange={v => updateData({ unearned: v })} />
          <InputField label="Gross Earned Income" hint="Wages before any deductions" value={data.earned} onChange={v => updateData({ earned: v })} />
          <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <input type="checkbox" checked={data.isStudent || false} onChange={e => updateData({ isStudent: e.target.checked })} className="accent-blue-600" />
            <span className="text-sm">Student under 22 (SEIE: up to ${FEDERAL_RATES.SEIE_MONTHLY}/mo excluded)</span>
          </label>
        </div>
      )
    },
    {
      title: 'Work Incentive Deductions',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">These reduce countable income, increasing your SSI/SSP.</p>
          <InputField label="IRWE (Impairment-Related Work Expenses)" hint="Disability-related costs needed for work" value={data.irwe} onChange={v => updateData({ irwe: v })} />
          {data.category === 'blind' && <InputField label="BWE (Blind Work Expenses)" hint="Any work expense: taxes, meals, uniforms, etc." value={data.bwe} onChange={v => updateData({ bwe: v })} />}
          <InputField label="PASS (Plan to Achieve Self-Support)" hint="Income set aside in SSA-approved plan" value={data.pass} onChange={v => updateData({ pass: v })} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= activeStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
        ))}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{questions[activeStep].title}</h3>
      {questions[activeStep].content}
      <div className="flex gap-3 pt-2">
        {activeStep > 0 && <button onClick={handleBack} className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>}
        <button onClick={handleNext} disabled={!canContinue()} className={`flex-1 py-3 rounded-xl font-medium transition-all ${canContinue() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {activeStep < 4 ? 'Continue' : 'Calculate Payment'}
        </button>
      </div>
    </div>
  );
}
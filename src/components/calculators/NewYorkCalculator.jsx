import { useState, useCallback } from 'react';
import RadioOption from '../ui/RadioOption';
import InputField from '../ui/InputField';
import { FEDERAL_RATES } from '../../data/federalRates';
import { NY_RATES, NY_LIVING_LABELS, NY_LIVING_DESCRIPTIONS } from '../../data/newYorkRates';
import { STATES } from '../../data/states';

export default function NewYorkCalculator() {
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

  const calculate = () => {
    const FED = FEDERAL_RATES;
    const rateData = data.household === 'couple' 
      ? NY_RATES.couple[data.living]
      : NY_RATES.single[data.living];
    
    const base = rateData.total;

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
    const bwe = data.isBlind ? Math.min(earned, data.bwe || 0) : 0;
    const countableEarned = Math.max(0, earned - bwe);

    // Total Countable Income
    const passDeduction = Math.min(countableUnearned + countableEarned, data.pass || 0);
    const totalCountable = Math.max(0, countableUnearned + countableEarned - passDeduction);

    // Calculate payment
    const ssiPayment = Math.max(0, base - totalCountable);
    const totalIncome = ssiPayment + (data.unearned || 0) + grossEarned - (data.irwe || 0) - (data.bwe || 0) - (data.pass || 0);

    // 1619(b) check
    const annualEarnings = grossEarned * 12;
    const qualifies1619b = ssiPayment === 0 && grossEarned > 0 && annualEarnings <= STATES.NY.threshold1619b;

    setResults({
      base,
      federal: rateData.federal,
      state: rateData.state,
      pna: rateData.pna || null,
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
      household: data.household
    });
  };

  const getActiveStep = () => {
    if (!data.household) return 0;
    if (!data.living) return 1;
    if (step <= 2) return 2;
    return 3;
  };

  const activeStep = results ? -1 : getActiveStep();

  const canContinue = () => {
    if (activeStep === 0) return !!data.household;
    if (activeStep === 1) return !!data.living;
    return true;
  };

  const handleBack = () => {
    if (activeStep === 1) updateData({ household: null, living: null });
    else if (activeStep === 2) updateData({ living: null });
    else setStep(step - 1);
  };

  const handleNext = () => {
    if (activeStep < 3) setStep(step + 1);
    else calculate();
  };

  // Results View
  if (results) {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg">
          <p className="text-sm opacity-90 font-medium">Estimated New York SSI Payment</p>
          <p className="text-5xl font-bold my-2">${results.ssiPayment.toFixed(2)}<span className="text-lg font-normal">/mo</span></p>
          <p className="text-blue-100">Total Monthly Income: ${results.totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="font-semibold text-blue-900">Rate Breakdown</div>
          <p className="text-blue-700 text-sm">{NY_LIVING_LABELS[results.living]}</p>
          <div className="mt-2 text-sm space-y-1">
            <div className="flex justify-between"><span>Federal:</span><span>${results.federal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>NY State Supplement:</span><span>${results.state.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t border-blue-200 pt-1"><span>Base Rate:</span><span>${results.base.toFixed(2)}</span></div>
          </div>
          {results.pna && <p className="text-blue-600 text-xs mt-2">Personal Needs Allowance: ${results.pna}/mo</p>}
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
            <div className="flex justify-between font-bold text-emerald-700 border-t pt-2"><span>SSI Payment</span><span>${results.ssiPayment.toFixed(2)}</span></div>
          </div>
        </details>

        {results.qualifies1619b && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
            <p className="font-semibold text-purple-800">✓ 1619(b) Medicaid Protection May Apply</p>
            <p className="text-purple-600 text-xs">Annual earnings (${results.annualEarnings.toLocaleString()}) below NY threshold (${STATES.NY.threshold1619b.toLocaleString()})</p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
          <strong>Reminder:</strong> This is an estimate. Actual payments determined by SSA. Verify with your local SSA office.
        </div>

        <button onClick={reset} className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors">Start Over</button>
      </div>
    );
  }

  // Questions
  const questions = [
    {
      title: 'Household Type',
      content: (
        <div className="space-y-3">
          <RadioOption value="single" current={data.household} onChange={v => updateData({ household: v, living: null })} label="Individual" desc="Single SSI recipient" />
          <RadioOption value="couple" current={data.household} onChange={v => updateData({ household: v, living: null })} label="Eligible Couple" desc="Both spouses receive SSI" />
        </div>
      )
    },
    {
      title: 'Living Arrangement',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-2">Select your living situation in New York.</p>
          {(() => {
            const rates = data.household === 'couple' ? NY_RATES.couple : NY_RATES.single;
            const arrangements = Object.keys(rates).filter(k => data.household === 'single' || !['medicaidFacility', 'noStateSupplement'].includes(k));
            return arrangements.map(key => (
              <RadioOption
                key={key}
                value={key}
                current={data.living}
                onChange={v => updateData({ living: v })}
                label={NY_LIVING_LABELS[key]}
                desc={NY_LIVING_DESCRIPTIONS[key]}
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
          <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <input type="checkbox" checked={data.isBlind || false} onChange={e => updateData({ isBlind: e.target.checked })} className="accent-blue-600" />
            <span className="text-sm">Statutorily blind</span>
          </label>
        </div>
      )
    },
    {
      title: 'Work Incentive Deductions',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">These reduce countable income, increasing your SSI.</p>
          <InputField label="IRWE (Impairment-Related Work Expenses)" hint="Disability-related costs needed for work" value={data.irwe} onChange={v => updateData({ irwe: v })} />
          {data.isBlind && <InputField label="BWE (Blind Work Expenses)" hint="Any work expense: taxes, meals, uniforms, etc." value={data.bwe} onChange={v => updateData({ bwe: v })} />}
          <InputField label="PASS (Plan to Achieve Self-Support)" hint="Income set aside in SSA-approved plan" value={data.pass} onChange={v => updateData({ pass: v })} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= activeStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
        ))}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{questions[activeStep].title}</h3>
      {questions[activeStep].content}
      <div className="flex gap-3 pt-2">
        {activeStep > 0 && <button onClick={handleBack} className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>}
        <button onClick={handleNext} disabled={!canContinue()} className={`flex-1 py-3 rounded-xl font-medium transition-all ${canContinue() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {activeStep < 3 ? 'Continue' : 'Calculate Payment'}
        </button>
      </div>
    </div>
  );
}
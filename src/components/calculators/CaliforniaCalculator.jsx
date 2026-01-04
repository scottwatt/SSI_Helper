import { useState, useCallback } from 'react';
import RadioOption from '../ui/RadioOption';
import InputField from '../ui/InputField';
import { FEDERAL_RATES } from '../../data/federalRates';
import { CATEGORY_LABELS, LIVING_LABELS } from '../../data/californiaRates';
import { STATES } from '../../data/states';
import { getSSIBaseRate, calculateCaliforniaSSI } from '../../utils/calculations';

export default function CaliforniaCalculator() {
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
    const result = calculateCaliforniaSSI(data);
    setResults(result);
  };

  // Determine active step based on data
  const getActiveStep = () => {
    if (!data.household) return 0;
    if (data.household === 'single' && !data.category) return 1;
    if (data.household === 'couple' && !data.coupleType) return 1;
    if (!data.living) return 2;
    if (step <= 3) return 3;
    return 4;
  };

  const activeStep = results ? -1 : getActiveStep();

  const canContinue = () => {
    if (activeStep === 0) return !!data.household;
    if (activeStep === 1) return data.household === 'single' ? !!data.category : !!data.coupleType;
    if (activeStep === 2) return !!data.living;
    return true;
  };

  const handleBack = () => {
    if (activeStep === 1) updateData({ household: null, category: null, coupleType: null });
    else if (activeStep === 2) updateData({ category: null, coupleType: null, living: null });
    else if (activeStep === 3) updateData({ living: null });
    else setStep(step - 1);
  };

  const handleNext = () => {
    if (activeStep < 4) {
      setStep(step + 1);
    } else {
      calculate();
    }
  };

  // Results View
  if (results) {
    return (
      <div className="space-y-4">
        {/* Main Result */}
        <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
          <p className="text-sm opacity-90 font-medium">Estimated California SSI Payment</p>
          <p className="text-5xl font-bold my-2">
            ${results.ssiPayment.toFixed(2)}
            <span className="text-lg font-normal">/mo</span>
          </p>
          <p className="text-emerald-100">
            Total Monthly Income: ${results.totalIncome.toFixed(2)}
          </p>
        </div>

        {/* Category Info */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="font-semibold text-blue-900">Your Category</div>
          <p className="text-blue-700 text-sm">
            {CATEGORY_LABELS[results.category || results.coupleType]} • {LIVING_LABELS[results.living]}
          </p>
          <p className="text-blue-600 text-sm">
            Base Rate: ${results.base.toFixed(2)}/mo
          </p>
        </div>

        {/* Calculation Details */}
        <details className="bg-gray-50 rounded-xl border border-gray-200">
          <summary className="p-4 font-semibold cursor-pointer text-gray-800">
            View Calculation Details
          </summary>
          <div className="p-4 pt-0 text-sm space-y-2 border-t border-gray-200 mt-2">
            <div className="flex justify-between">
              <span>Gross Unearned</span>
              <span>${data.unearned || 0}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>– GIE</span>
              <span>-${results.gieOnUnearned}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Countable Unearned</span>
              <span>${results.countableUnearned.toFixed(2)}</span>
            </div>

            {(data.earned || 0) > 0 && (
              <>
                <div className="border-t pt-2 mt-2"></div>
                <div className="flex justify-between">
                  <span>Gross Earned</span>
                  <span>${data.earned}</span>
                </div>
                {results.seie > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>– SEIE</span>
                    <span>-${results.seie}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>– EIE</span>
                  <span>-${results.eie}</span>
                </div>
                {results.irwe > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>– IRWE</span>
                    <span>-${results.irwe}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>÷ 2 (50% exclusion)</span>
                  <span></span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Countable Earned</span>
                  <span>${results.countableEarned.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="border-t pt-2 mt-2"></div>
            <div className="flex justify-between">
              <span>Total Countable</span>
              <span>${results.totalCountable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Rate</span>
              <span>${results.base.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-700 border-t pt-2">
              <span>SSI Payment</span>
              <span>${results.ssiPayment.toFixed(2)}</span>
            </div>
          </div>
        </details>

        {/* 1619(b) Notice */}
        {results.qualifies1619b && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
            <p className="font-semibold text-purple-800">
              ✓ 1619(b) Medicaid Protection May Apply
            </p>
            <p className="text-purple-600 text-xs">
              Annual earnings (${results.annualEarnings.toLocaleString()}) below CA 
              threshold (${STATES.CA.threshold1619b.toLocaleString()})
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
          <strong>Reminder:</strong> This is an estimate. Actual payments 
          determined by SSA. Verify with your local SSA office.
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  // Questions
  const questions = [
    // Step 0: Household Type
    {
      title: 'Household Type',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            An "eligible couple" means both spouses receive SSI.
          </p>
          <RadioOption
            value="single"
            current={data.household}
            onChange={v => updateData({ household: v, category: null, coupleType: null, living: null })}
            label="Single Person"
            desc="Individual SSI recipient"
          />
          <RadioOption
            value="couple"
            current={data.household}
            onChange={v => updateData({ household: v, category: null, coupleType: null, living: null })}
            label="Eligible Couple"
            desc="Both spouses receive SSI"
          />
        </div>
      )
    },
    // Step 1: Category
    {
      title: data.household === 'single' ? 'Eligibility Category' : 'Couple Type',
      content: (
        <div className="space-y-3">
          {data.household === 'single' ? (
            <>
              <RadioOption value="aged" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Aged (65+)" desc="Age 65 or older" />
              <RadioOption value="disabled" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Disabled" desc="Have a qualifying disability" />
              <RadioOption value="blind" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Blind" desc="Meet SSA statutory blindness criteria" />
              <RadioOption value="minorDisabled" current={data.category} onChange={v => updateData({ category: v, living: null })} label="Minor with Disability" desc="Under 18 with qualifying disability" />
            </>
          ) : (
            <>
              <RadioOption value="bothAgedOrDisabled" current={data.coupleType} onChange={v => updateData({ coupleType: v, category: 'couple', living: null })} label="Both Aged or Disabled" desc="Neither spouse is blind" />
              <RadioOption value="bothBlind" current={data.coupleType} onChange={v => updateData({ coupleType: v, category: 'couple', living: null })} label="Both Blind" desc="Both meet blindness criteria" />
              <RadioOption value="mixedBlindAndAgedDisabled" current={data.coupleType} onChange={v => updateData({ coupleType: v, category: 'couple', living: null })} label="One Blind, One Aged/Disabled" desc="Mixed couple" />
            </>
          )}
        </div>
      )
    },
    // Step 2: Living Arrangement
    {
      title: 'Living Arrangement',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            This significantly affects your payment amount.
          </p>
          {(() => {
            const isMinor = data.category === 'minorDisabled';
            const isBlind = data.category === 'blind';
            const arrangements = isMinor
              ? [
                  ['independent', 'Independent Living', 'Living on own or with parent(s)'],
                  ['inHousehold', 'In Household of Another', "Living in someone else's household"]
                ]
              : [
                  ['independent', 'Independent Living', 'Paying fair share of housing'],
                  ['noKitchen', 'No Cooking Facilities', 'Residence lacks kitchen'],
                  ['inHousehold', 'In Household of Another', 'Not paying fair share (VTR)'],
                  ['nonMedicalCare', 'Non-Medical Out-of-Home Care', 'Board and care, assisted living'],
                  ['medicaidFacility', 'Medicaid Facility', 'Nursing home']
                ].filter(([v]) => !(isBlind && v === 'noKitchen'));

            return arrangements.map(([val, label, desc]) => {
              const rate = getSSIBaseRate('CA', data.category || data.coupleType, data.coupleType, val);
              return (
                <RadioOption
                  key={val}
                  value={val}
                  current={data.living}
                  onChange={v => updateData({ living: v })}
                  label={label}
                  desc={desc}
                  rate={rate ? `$${rate.toFixed(2)}` : null}
                />
              );
            });
          })()}
        </div>
      )
    },
    // Step 3: Income
    {
      title: 'Monthly Income',
      content: (
        <div className="space-y-4">
          <InputField
            label="Unearned Income"
            hint="SSDI, VA benefits, pensions, etc. (First $20 excluded)"
            value={data.unearned}
            onChange={v => updateData({ unearned: v })}
          />
          <InputField
            label="Gross Earned Income"
            hint="Wages before any deductions"
            value={data.earned}
            onChange={v => updateData({ earned: v })}
          />
          {data.category !== 'minorDisabled' && (
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={data.isStudent || false}
                onChange={e => updateData({ isStudent: e.target.checked })}
                className="accent-blue-600"
              />
              <span className="text-sm">
                Student under 22 (SEIE: up to ${FEDERAL_RATES.SEIE_MONTHLY}/mo excluded)
              </span>
            </label>
          )}
        </div>
      )
    },
    // Step 4: Work Incentives
    {
      title: 'Work Incentive Deductions',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These reduce countable income, increasing your SSI.
          </p>
          <InputField
            label="IRWE (Impairment-Related Work Expenses)"
            hint="Disability-related costs needed for work"
            value={data.irwe}
            onChange={v => updateData({ irwe: v })}
          />
          {data.category === 'blind' && (
            <InputField
              label="BWE (Blind Work Expenses)"
              hint="Any work expense: taxes, meals, uniforms, etc."
              value={data.bwe}
              onChange={v => updateData({ bwe: v })}
            />
          )}
          <InputField
            label="PASS (Plan to Achieve Self-Support)"
            hint="Income set aside in SSA-approved plan"
            value={data.pass}
            onChange={v => updateData({ pass: v })}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= activeStep ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h3 className="font-semibold text-lg text-gray-900">
        {questions[activeStep].title}
      </h3>
      {questions[activeStep].content}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {activeStep > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            canContinue()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {activeStep < 4 ? 'Continue' : 'Calculate Payment'}
        </button>
      </div>
    </div>
  );
}
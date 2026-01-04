import { useState, useCallback } from 'react';
import RadioOption from '../ui/RadioOption';
import InputField from '../ui/InputField';
import { FEDERAL_RATES } from '../../data/federalRates';
import { calculateFederalSSI } from '../../utils/calculations';

export default function FederalCalculator({ stateName = 'your state' }) {
  const [data, setData] = useState({});
  const [results, setResults] = useState(null);

  const FED = FEDERAL_RATES;

  const updateData = useCallback((updates) => {
    setData(d => ({ ...d, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setData({});
    setResults(null);
  }, []);

  const calculate = () => {
    const result = calculateFederalSSI(data);
    setResults(result);
  };

  // Results View
  if (results) {
    return (
      <div className="space-y-4">
        {/* Main Result */}
        <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
          <p className="text-sm opacity-90">Estimated SSI (Federal Only)</p>
          <p className="text-5xl font-bold my-2">
            ${results.ssi.toFixed(2)}
            <span className="text-lg">/mo</span>
          </p>
        </div>

        {/* Calculation Summary */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Base Rate</span>
            <span>${results.base.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Countable Income</span>
            <span>-${results.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>SSI Payment</span>
            <span>${results.ssi.toFixed(2)}</span>
          </div>
        </div>

        {/* State Supplement Warning */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm">
          <p className="font-semibold text-amber-800">⚠️ Federal Rates Only</p>
          <p className="text-amber-700">
            Check if {stateName} has a state supplement that would increase this amount.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 p-3 rounded-xl text-xs text-gray-600">
          This is an estimate. Verify with your local SSA office.
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="w-full py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  // Calculator Form
  return (
    <div className="space-y-4">
      {/* Living Situation */}
      <h3 className="font-semibold text-lg">Living Situation</h3>
      <div className="space-y-3">
        <RadioOption
          value="independent"
          current={data.living}
          onChange={v => updateData({ living: v })}
          label="Independent Living"
          rate={`$${FED.SSI_FBR}/mo`}
        />
        <RadioOption
          value="couple"
          current={data.living}
          onChange={v => updateData({ living: v })}
          label="Eligible Couple"
          rate={`$${FED.SSI_FBR_COUPLE}/mo`}
        />
        <RadioOption
          value="vtr"
          current={data.living}
          onChange={v => updateData({ living: v })}
          label="In Another's Household"
          desc="Value of One-Third Reduction applies"
          rate={`$${FED.VTR}/mo`}
        />
      </div>

      {/* Income */}
      <h3 className="font-semibold text-lg pt-2">Monthly Income</h3>
      <div className="space-y-4">
        <InputField
          label="Unearned Income"
          hint="SSDI, VA benefits, pensions, etc."
          value={data.unearned}
          onChange={v => updateData({ unearned: v })}
        />
        <InputField
          label="Gross Earned Income"
          hint="Wages before deductions"
          value={data.earned}
          onChange={v => updateData({ earned: v })}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={data.isBlind || false}
            onChange={e => updateData({ isBlind: e.target.checked })}
            className="accent-blue-600"
          />
          <span className="text-sm">Statutorily blind</span>
        </label>
      </div>

      {/* Work Incentives (Collapsed by default) */}
      <details className="bg-gray-50 rounded-xl border border-gray-200">
        <summary className="p-3 font-medium cursor-pointer text-gray-700">
          Work Incentive Deductions (Optional)
        </summary>
        <div className="p-3 pt-0 space-y-3 border-t border-gray-200 mt-2">
          <InputField
            label="IRWE"
            hint="Impairment-Related Work Expenses"
            value={data.irwe}
            onChange={v => updateData({ irwe: v })}
          />
          {data.isBlind && (
            <InputField
              label="BWE"
              hint="Blind Work Expenses"
              value={data.bwe}
              onChange={v => updateData({ bwe: v })}
            />
          )}
          <InputField
            label="PASS"
            hint="Plan to Achieve Self-Support"
            value={data.pass}
            onChange={v => updateData({ pass: v })}
          />
        </div>
      </details>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        disabled={!data.living}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          data.living
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Calculate Payment
      </button>
    </div>
  );
}
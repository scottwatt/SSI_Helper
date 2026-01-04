import { STATES, IMPLEMENTED_STATES, COMING_SOON_STATES } from '../data/states';

export default function StateSelector({ onSelectState }) {
  const federalOnlyStates = ['TX', 'FL', 'PA'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-3">
        <div className="text-4xl mb-2">🗺️</div>
        <h2 className="text-xl font-bold text-gray-900">Select Your State</h2>
        <p className="text-sm text-gray-500 mt-1">
          SSI rates vary by state supplement programs
        </p>
      </div>

      {/* Implemented States */}
      <div className="space-y-2">
        <div className="text-xs text-emerald-600 font-medium px-1">
          Full state supplement rates available:
        </div>
        {IMPLEMENTED_STATES.map(code => (
          <button
            key={code}
            onClick={() => onSelectState(code)}
            className="w-full p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-emerald-800">
                  {STATES[code].name}
                </div>
                <div className="text-xs text-emerald-600">
                  ✓ {STATES[code].notes}
                </div>
              </div>
              <span className="text-emerald-600 text-xl">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="text-xs text-gray-400 text-center py-2 font-medium">
        Federal rates (no state supplement data):
      </div>

      {/* Federal-only States */}
      <div className="space-y-2">
        {federalOnlyStates.map(code => (
          <button
            key={code}
            onClick={() => onSelectState(code)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">
              {STATES[code].name}
            </div>
            <div className="text-xs text-gray-500">
              {STATES[code].notes}
            </div>
          </button>
        ))}

        {/* Other State Option */}
        <button
          onClick={() => onSelectState('OTHER')}
          className="w-full p-3 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="font-medium text-gray-900">Other State</div>
          <div className="text-xs text-gray-500">
            Uses federal SSI rates
          </div>
        </button>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-800 border border-blue-200">
        <p className="font-semibold">Coming Soon:</p>
        <p>{COMING_SOON_STATES.join(', ')} state supplement rates</p>
      </div>
    </div>
  );
}
export default function Disclaimer({ onAccept }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
          <h1 className="text-xl font-bold text-white">Important Notice</h1>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              <strong>This tool provides estimates only.</strong> Actual SSI 
              payments are determined solely by the Social Security 
              Administration (SSA).
            </p>
            
            <p>
              This calculator does not constitute financial, legal, or benefits 
              advice. Results may differ from actual SSA determinations due to 
              individual circumstances not captured here.
            </p>
            
            <p>By using this tool, you acknowledge that:</p>
            
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Estimates are for educational purposes</li>
              <li>You should verify all information with SSA</li>
              <li>Rate accuracy depends on current published guidelines</li>
              <li>Individual eligibility requires SSA determination</li>
            </ul>
          </div>
          
          <button 
            onClick={onAccept}
            className="
              w-full py-3 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white font-semibold rounded-xl 
              hover:from-blue-700 hover:to-indigo-700 
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            I Understand - Continue
          </button>
        </div>
      </div>
    </div>
  );
}
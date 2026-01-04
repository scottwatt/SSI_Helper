export default function Layout({ children, footer = true }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {children}
        </div>
        
        {footer && (
          <p className="text-center text-xs text-slate-400 mt-4">
            © {new Date().getFullYear()} Benefits Navigator • Educational Use Only
          </p>
        )}
      </div>
    </div>
  );
}

// Sub-components for consistent layout
export function Header({ children, onBack, showBack = false }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
      {showBack ? (
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Go back"
          >
            ←
          </button>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function Content({ children, className = '' }) {
  return (
    <div className={`p-5 max-h-[70vh] overflow-y-auto calculator-scroll ${className}`}>
      {children}
    </div>
  );
}
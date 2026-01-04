export default function RadioOption({ 
  value, 
  current, 
  onChange, 
  label, 
  desc, 
  rate 
}) {
  const isSelected = current === value;
  
  return (
    <label 
      className={`
        flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer 
        transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <input 
        type="radio" 
        checked={isSelected} 
        onChange={() => onChange(value)} 
        className="mt-1 accent-blue-600" 
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-900">{label}</span>
          {rate && (
            <span className="font-bold text-emerald-600 ml-2">{rate}</span>
          )}
        </div>
        {desc && (
          <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
        )}
      </div>
    </label>
  );
}
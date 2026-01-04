export default function InputField({ 
  label, 
  hint, 
  value, 
  onChange, 
  prefix = '$',
  placeholder = '0',
  type = 'number'
}) {
  const handleChange = (e) => {
    const val = type === 'number' 
      ? (parseFloat(e.target.value) || 0) 
      : e.target.value;
    onChange(val);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      )}
      <div className="relative mt-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input 
          type={type}
          value={value || ''} 
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full py-2.5 border-2 border-gray-200 rounded-lg 
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
            outline-none transition-colors
            ${prefix ? 'pl-8 pr-4' : 'px-4'}
          `}
        />
      </div>
    </div>
  );
}
import React from 'react';

const selectBaseClasses = `
  w-full p-2 border rounded-md transition duration-150 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
`;

const variantStyle = {
  default: 'text-gray-900 border-gray-300',
};

const Select = React.forwardRef(({
  label,
  error,
  options,
  variant = 'default',
  ...restProps
}, ref) => {

  if (!variantStyle[variant]) {
    console.warn(`Variant "${variant}" not supported for Select component.`);
  }

  const errorClass = error ? 'border-red-500' : variantStyle[variant];

  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={restProps.name} className='text-sm font-medium text-gray-700'>
        {label}
      </label>
      <select
        ref={ref}
        {...restProps}
        className={`${selectBaseClasses} ${errorClass} ${restProps.className || ''}`}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
    </div>
  );
});

export default Select;
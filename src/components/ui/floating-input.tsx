import * as React from 'react';

// Utility function to merge class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, type, onChange, value, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = (node: HTMLInputElement) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const [hasValue, setHasValue] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState('');

    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const formatDateForDisplay = (value: string) => {
      if (!value) return '';

      // Extract date part only (remove timestamp if present)
      const datePart = value.split('T')[0];

      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    };

    // Strip timestamp from value
    const getDateOnly = (value: any) => {
      if (!value) return '';
      const strValue = String(value);
      return strValue.split('T')[0];
    };

    // Check if input has value, prefer using controlled `value` prop when available
    const checkValue = React.useCallback(() => {
      const input = internalRef.current;
      const currentVal = value ?? input?.value ?? '';
      const hasVal = String(currentVal).trim() !== '';
      setHasValue(hasVal);

      // Update display value for date inputs
      if (type === 'date') {
        if (hasVal) {
          setDisplayValue(formatDateForDisplay(String(currentVal)));
        } else {
          setDisplayValue('');
        }
      }
    }, [type, value]);

    // Listen to DOM input/change events for immediate user typing feedback
    React.useEffect(() => {
      const input = internalRef.current;
      if (!input) return;

      // Initial check
      checkValue();

      // Listen to input changes (user typing)
      const handleInput = () => checkValue();

      input.addEventListener('input', handleInput);
      input.addEventListener('change', handleInput);

      return () => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('change', handleInput);
      };
    }, [checkValue]);

    // Also respond immediately when the controlled `value` prop changes (e.g., react-hook-form setValue)
    React.useEffect(() => {
      checkValue();
    }, [value, checkValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkValue();
      onChange?.(e);
    };

    return (
      <div className="relative">
        <input
          ref={mergedRef}
          type={type}
          value={type === 'date' ? getDateOnly(value) : value}
          className={cn(
            'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground bg-transparent border-input peer h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            type === 'date' &&
              '[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer',
            className
          )}
          onChange={handleChange}
          placeholder=" "
          style={
            type === 'date'
              ? {
                  color: 'transparent',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }
              : undefined
          }
          {...props}
        />

        {/* Display formatted date overlay or placeholder */}
        {type === 'date' && (
          <div className="absolute inset-0 flex items-center px-3 pr-10 pointer-events-none">
            {displayValue ? (
              <span className="text-sm text-foreground">{displayValue}</span>
            ) : (
              <span className="text-sm text-muted-foreground">dd/mm/yyyy</span>
            )}
          </div>
        )}

        <label
          className={cn(
            'absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none select-none',
            hasValue
              ? '-top-2 text-xs font-medium bg-card px-1'
              : 'top-1/2 -translate-y-1/2 text-sm px-1'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };

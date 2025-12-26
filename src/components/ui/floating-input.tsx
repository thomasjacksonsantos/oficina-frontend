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
    const hiddenDateRef = React.useRef<HTMLInputElement | null>(null);

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

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const formatDateForValue = (display: string) => {
      const cleaned = display.replace(/\D/g, '');
      if (cleaned.length === 8) {
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);
        return `${year}-${month}-${day}`;
      }
      return '';
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

      // Update display value for date inputs.
      // Keep the user's typed display while `value` is empty (partial input),
      // and only format from the controlled `value` when it is present.
      if (type === 'date') {
        if (value) {
          // When a controlled value (YYYY-MM-DD) is provided, format it for display
          setDisplayValue(formatDateForDisplay(String(value)));
        } else if (input?.value) {
          // Preserve what the user is typing (DD/MM/YYYY partial) so typing isn't interrupted
          setDisplayValue(input.value);
        } else {
          // No value and nothing typed
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

    // Handle manual text input for date (DD/MM/YYYY format)
    const handleDisplayInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/\D/g, '');
      input = input.slice(0, 8);

      let formatted = '';
      if (input.length > 0) {
        formatted = input.slice(0, 2);
        if (input.length > 2) {
          formatted += '/' + input.slice(2, 4);
        }
        if (input.length > 4) {
          formatted += '/' + input.slice(4, 8);
        }
      }

      setDisplayValue(formatted);
      setHasValue(formatted.length > 0);

      // Convert to YYYY-MM-DD and trigger onChange
      const standardDate = formatDateForValue(formatted);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: standardDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    // Handle hidden date picker change
    const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pickerValue = e.target.value;
      setDisplayValue(formatDateForDisplay(pickerValue));
      setHasValue(!!pickerValue);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: pickerValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    // Validate date on blur. If invalid, clear the field and notify parent with empty value.
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const current = displayValue || '';
      const cleaned = current.replace(/\D/g, '');

      // If empty, ensure parent value is empty and clear visible state
      if (!cleaned) {
        const syntheticEvent = {
          ...e,
          target: {
            ...(e.target as HTMLInputElement),
            value: '',
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        setHasValue(false);
        setDisplayValue('');
        return;
      }

      // Must be DDMMYYYY
      if (cleaned.length !== 8) {
        const syntheticEvent = {
          ...e,
          target: {
            ...(e.target as HTMLInputElement),
            value: '',
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        setHasValue(false);
        setDisplayValue('');
        return;
      }

      const day = Number(cleaned.slice(0, 2));
      const month = Number(cleaned.slice(2, 4));
      const year = Number(cleaned.slice(4, 8));

      const date = new Date(year, month - 1, day);
      const valid =
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

      if (!valid) {
        const syntheticEvent = {
          ...e,
          target: {
            ...(e.target as HTMLInputElement),
            value: '',
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        setHasValue(false);
        setDisplayValue('');
        return;
      }

      // Valid date — format to YYYY-MM-DD and notify parent
      const iso = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      setDisplayValue(formatDateForDisplay(iso));
      setHasValue(true);

      const syntheticEvent = {
        ...e,
        target: {
          ...(e.target as HTMLInputElement),
          value: iso,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkValue();
      onChange?.(e);
    };

    // Open date picker when calendar icon is clicked
    const openDatePicker = () => {
      hiddenDateRef.current?.showPicker?.();
    };

    // Special handling for date type
    if (type === 'date') {
      return (
        <div className="relative">
          {/* Visible text input for manual DD/MM/YYYY entry */}
          <input
            ref={mergedRef}
            type="text"
            value={displayValue}
            onChange={handleDisplayInput}
            onBlur={handleBlur}
            className={cn(
              'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground bg-transparent border-input peer h-9 w-full min-w-0 rounded-md border px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              className
            )}
            placeholder=" "
            {...props}
          />

          {/* Hidden native date input for picker */}
          <input
            ref={hiddenDateRef}
            type="date"
            value={getDateOnly(value)}
            onChange={handleDatePickerChange}
            className="absolute opacity-0 pointer-events-none"
            tabIndex={-1}
          />

          {/* Calendar icon button */}
          <button
            type="button"
            onClick={openDatePicker}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            tabIndex={-1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </button>

          {/* Placeholder when empty */}
          {!displayValue && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-muted-foreground">
              dd/mm/yyyy
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

    return (
      <div className="relative">
        <input
          ref={mergedRef}
          type={type}
          value={value}
          className={cn(
            'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground bg-transparent border-input peer h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            className
          )}
          onChange={handleChange}
          placeholder=" "
          {...props}
        />

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

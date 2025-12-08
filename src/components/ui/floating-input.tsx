import * as React from 'react';

// Utility function to merge class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, type, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = (node: HTMLInputElement) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const [hasValue, setHasValue] = React.useState(false);

    // Check if input has value
    const checkValue = React.useCallback(() => {
      const input = internalRef.current;
      if (!input) return;
      setHasValue(input.value.trim() !== '');
    }, []);

    // Detect changes using polling for React Hook Form setValue
    React.useEffect(() => {
      const input = internalRef.current;
      if (!input) return;

      // Initial check
      checkValue();

      // Listen to input changes (user typing)
      const handleInput = () => checkValue();
      input.addEventListener('input', handleInput);
      input.addEventListener('change', handleInput);

      // Poll to detect programmatic changes (React Hook Form setValue)
      const intervalId = setInterval(checkValue, 100);

      return () => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('change', handleInput);
        clearInterval(intervalId);
      };
    }, [checkValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkValue();
      onChange?.(e);
    };

    return (
      <div className="relative">
        <input
          ref={mergedRef}
          type={type}
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
import * as React from "react"

// Utility function to merge class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, type, onChange, inputMode, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = (node: HTMLInputElement) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const [hasValue, setHasValue] = React.useState(false);

    // Detect initial value and changes caused by reset()
    React.useEffect(() => {
      const input = internalRef.current;
      if (!input) return;

      const update = () => setHasValue(input.value.trim() !== "");

      // Initial check
      update();

      // Listen to input changes
      input.addEventListener("input", update);

      // MutationObserver catches reset() updates
      const observer = new MutationObserver(update);
      observer.observe(input, { attributes: true, attributeFilter: ["value"] });

      return () => {
        input.removeEventListener("input", update);
        observer.disconnect();
      };
    }, []);

    return (
      <div className="relative">
        <input
          ref={mergedRef}
          type={type}
          className={cn(
            "file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input peer h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:opacity-50 md:text-sm",
            className
          )}
          onChange={onChange}
          placeholder=" "
          {...props}
        />

        <label
          className={cn(
            "absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none select-none px-1",
            hasValue || inputMode === "numeric"
              ? "-top-2 text-xs font-medium bg-white rounded-md dark:bg-gray-950 text-ring"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);



FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
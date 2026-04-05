import * as React from "react";
import { Input } from "@/components/ui/input";

export type FloatingLabelInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> & {
  label: string;
};

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className = "", label, id, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          id={id}
          disabled={disabled}
          placeholder=" " // यह placeholder अनिवार्य है ताकि CSS peer-placeholder-shown काम करे
          className={[
            "peer h-12 w-full px-3  placeholder:text-transparent",
            className,
          ].join(" ")}
          {...props}
        />
        <label
          htmlFor={id}
          className={[
            // Base Styles: लेबल को बीच में रखना
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            "transition-all duration-200 ease-out",
            
            // गायब होने वाला लॉजिक (Focus होने पर)
            "peer-focus:opacity-0 peer-focus:invisible peer-focus:-translate-y-full",
            
            // गायब होने वाला लॉजिक (अगर इनपुट खाली न हो)
            "peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:invisible peer-[:not(:placeholder-shown)]:-translate-y-full",
            
            disabled ? "opacity-50" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
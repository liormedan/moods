import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      showValue = true,
      min = 1,
      max = 10,
      step = 1,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider',
              className
            )}
            ref={ref}
            {...props}
          />
          {showValue && (
            <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
              {props.value || min}
            </span>
          )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };

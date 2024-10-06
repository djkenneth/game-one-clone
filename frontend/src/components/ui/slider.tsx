import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

type SliderProps = {
  className?: string;
  defaultValue: number[];
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const Slider = React.forwardRef(
  ({ className, defaultValue, min, max, step, formatLabel, value, onValueChange, ...props }: SliderProps, ref) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = React.useState(initialValue);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn('relative mb-6 flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-red-600">
          <SliderPrimitive.Range className="absolute h-full bg-red-600" />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute space-x-2 text-center text-gray-500"
              style={{
                // left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                left: `${index === 0 ? '0px' : '70px'}`,
                top: `10px`
              }}
            >
              {index === 1 && <span>-</span>}
              <span className="text-sm">{formatLabel ? formatLabel(value) : value}</span>
            </div>
            <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border border-red-600 bg-red-600 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

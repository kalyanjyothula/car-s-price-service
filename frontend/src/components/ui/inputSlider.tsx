import { Slider } from "./slider";

interface inputSliderProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number[];
  handleValueChange: (val: number[]) => void;
}

export default function InputSlider(props: inputSliderProps) {
  const {
    label,
    min = 0,
    max = 100,
    defaultValue = 25,
    step = 1,
    value,
    handleValueChange,
  } = props;
  return (
    <div>
      {label && (
        <p className="text-lg text-left font-bold pb-2">
          {label} : <span className="text-green-500 font-medium"> {value}</span>
        </p>
      )}
      <div className="flex gap-x-2">
        <p className="text-lg text-left font-bold">{min}</p>
        <Slider
          defaultValue={[defaultValue]}
          min={min}
          max={max}
          step={step}
          className="rounded-2xl cursor-pointer"
          onValueChange={handleValueChange}
        />
        <p className="text-lg text-left font-bold">{max}</p>
      </div>
    </div>
  );
}

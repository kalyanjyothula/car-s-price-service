import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InputRadioGroupProps {
  radioGroup: {
    label: string;
    value: string;
    id: string;
  }[];
  defaultValue?: string;
  label: string;
  handleValueChange: (val: string) => void;
}

export function InputRadioGroup(props: InputRadioGroupProps) {
  const { radioGroup, defaultValue = "", label, handleValueChange } = props;
  return (
    <div className="py-2">
      {label && <p className="text-lg text-left font-bold pb-2">{label}</p>}
      <RadioGroup
        defaultValue={defaultValue}
        className="flex flex-wrap gap-4"
        onValueChange={handleValueChange}
      >
        {radioGroup.length &&
          radioGroup.map(({ label, value, id }) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={value}
                id={id}
                className="border-[1px] border-gray-400 cursor-pointer"
              />
              <label htmlFor={id} className="text-lg cursor-pointer">
                {label}
              </label>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
}

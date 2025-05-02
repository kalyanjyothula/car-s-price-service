import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
  SelectLabel,
} from "@/components/ui/select";

interface InputDropdownProps {
  label: string;
  value?: string;
  selectLabel?: string;
  options: {
    value: string;
    label: string;
  }[];
  handleValueChange: (val: string) => void;
}

export default function InputDropdown(props: InputDropdownProps) {
  const { label, value, selectLabel, options, handleValueChange } = props;
  return (
    <div className="w-full">
      {label && <p className="text-lg text-left font-bold pb-2">{label}</p>}
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger color="indigo" className="w-full pt-2">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
            {options.length &&
              options.map(({ label, value }) => (
                <SelectItem value={value}>{label}</SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

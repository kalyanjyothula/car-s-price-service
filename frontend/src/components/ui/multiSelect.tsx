"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectDropdownProps {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  selected: string[];
  setSelected: (val: any) => void;
}

export default function MultiSelectDropdown(props: MultiSelectDropdownProps) {
  const { label, options, setSelected, selected } = props;

  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    setSelected((prev: any) =>
      prev.includes(value)
        ? prev.filter((item: any) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="flex flex-col">
      {label && <p className="text-lg text-left font-bold pb-2">{label}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between cursor-pointer"
          >
            {selected.length > 0 ? `${selected.length} selected` : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              {options.length &&
                options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => toggleOption(option.value)}
                    />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

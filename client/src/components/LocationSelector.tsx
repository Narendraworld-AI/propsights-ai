import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INDIAN_CITIES, SEARCHABLE_LOCATIONS } from "@/lib/mockData";

interface LocationSelectorProps {
  onSelect: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function LocationSelector({ onSelect, className, placeholder = "Select a location..." }: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onSelect(currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-12 text-left font-normal bg-white hover:bg-slate-50 border-slate-200", className)}
        >
          <div className="flex items-center gap-2 truncate text-slate-700">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            {value
              ? SEARCHABLE_LOCATIONS.find((l) => l.label === value)?.label || value
              : <span className="text-slate-400">{placeholder}</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
        <Command className="max-h-[300px]">
          <CommandInput placeholder="Search city, area, or locality..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            {Object.entries(INDIAN_CITIES).map(([city, areas]) => (
              <React.Fragment key={city}>
                <CommandGroup heading={city}>
                  {areas.map((area) => {
                    const fullLabel = `${area}, ${city}`;
                    return (
                      <CommandItem
                        key={fullLabel}
                        value={fullLabel}
                        onSelect={handleSelect}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === fullLabel ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {area}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

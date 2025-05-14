import { useState } from "react";

import { format, subHours } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn, generateData } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface DatePickerProps {
  date: { start: Date; end: Date };
  setDate: React.Dispatch<React.SetStateAction<{ start: Date; end: Date }>>;
}
interface SensorPickerProps {
  sensors: { id: string; name: string; unit: string }[];
  selectedSensor: string;
  setSelectedSensor: React.Dispatch<React.SetStateAction<string>>;
}
interface SelectTimeButtonsProps extends DatePickerProps {
  now: Date;
  selectedSensor: string;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export function StartDatePicker({ date, setDate }: DatePickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Start Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date.start && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.start ? (
              format(date.start, "PPP HH:mm")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.start}
            onSelect={(selectDate) =>
              selectDate && setDate({ ...date, start: selectDate })
            }
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <Select
              value={date.start?.getHours().toString()}
              onValueChange={(value) => {
                const newDate = new Date(date.start);
                newDate.setHours(Number.parseInt(value));
                setDate({ ...date, start: newDate });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function EndDatePicker({ date, setDate }: DatePickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">End Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date.end && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.end ? (
              format(date.end, "PPP HH:mm")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.end}
            onSelect={(selectDate) =>
              selectDate && setDate({ ...date, end: selectDate })
            }
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <Select
              value={date.end?.getHours().toString()}
              onValueChange={(value) => {
                const newDate = new Date(date.end);
                newDate.setHours(Number.parseInt(value));
                setDate({ ...date, end: newDate });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SensorPicker({
  sensors,
  selectedSensor,
  setSelectedSensor,
}: SensorPickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Sensors</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedSensor}
            {/* ? `${selectedSensors.length} sensor${
                  selectedSensors.length > 1 ? "s" : ""
                } selected`
              : "Select sensors..."} */}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search sensors..." />
            <CommandList>
              <CommandEmpty>No sensor found.</CommandEmpty>
              <CommandGroup>
                {sensors.map((sensor) => (
                  <CommandItem
                    key={sensor.id}
                    value={sensor.id}
                    onSelect={(value) => {
                      setSelectedSensor(value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSensor.includes(sensor.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {sensor.name} ({sensor.unit})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SelectTimeButtons({
  now,
  date,
  selectedSensor,
  setDate,
  setData,
}: SelectTimeButtonsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={() => setDate({ end: now, start: subHours(now, 24) })}
      >
        Last 24 Hours
      </Button>
      <Button
        variant="outline"
        onClick={() => setDate({ end: now, start: subHours(now, 6) })}
      >
        Last 6 Hours
      </Button>
      <Button
        onClick={() =>
          setData(generateData(date.start, date.end, selectedSensor))
        }
      >
        Refresh Data
      </Button>
    </div>
  );
}

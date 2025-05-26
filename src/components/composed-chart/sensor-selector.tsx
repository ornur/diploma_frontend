"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { SensorColumn } from "@/types/sensor"

interface SensorSelectorProps {
  sensors: readonly SensorColumn[]
  selectedSensor: string
  onSensorChange: (sensorId: string) => void
}

export function SensorSelector({ sensors, selectedSensor, onSensorChange }: SensorSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedSensorData = sensors.find((sensor) => sensor.id === selectedSensor)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Sensor</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedSensorData?.name || "Select sensor..."}
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
                    onSelect={() => {
                      onSensorChange(sensor.id)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedSensor === sensor.id ? "opacity-100" : "opacity-0")} />
                    {sensor.name} ({sensor.unit})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

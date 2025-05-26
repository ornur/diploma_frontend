"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date
  onDateChange: (date: Date) => void
  label: string
}

export function DateTimePicker({ date, onDateChange, label }: DateTimePickerProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    newDate.setHours(date.getHours())
    newDate.setMinutes(date.getMinutes())
    onDateChange(newDate)
  }

  const handleHourChange = (hour: string) => {
    const newDate = new Date(date)
    newDate.setHours(Number.parseInt(hour))
    onDateChange(newDate)
  }

  const handleMinuteChange = (minute: string) => {
    const newDate = new Date(date)
    newDate.setMinutes(Number.parseInt(minute))
    onDateChange(newDate)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          <div className="p-3 border-t border-border flex items-center space-x-2">
            <label className="text-xs text-muted-foreground">Hour:</label>
            <Select value={date.getHours().toString().padStart(2, "0")} onValueChange={handleHourChange}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="text-xs text-muted-foreground">Minute:</label>
            <Select value={date.getMinutes().toString().padStart(2, "0")} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
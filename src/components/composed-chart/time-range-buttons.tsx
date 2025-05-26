"use client"

import { subHours } from "date-fns"
import { Button } from "@/components/ui/button"
import type { DateRange } from "@/types/sensor"

interface TimeRangeButtonsProps {
  dateRange: DateRange
  onDateRangeChange: (dateRange: DateRange) => void
  onRefresh: () => void
}

export function TimeRangeButtons({ dateRange, onDateRangeChange, onRefresh }: TimeRangeButtonsProps) {
  const handleTimeRangeSelect = (hours: number) => {
    onDateRangeChange({
      end: dateRange.start,
      start: subHours(dateRange.start, hours),
    })
  }

  return (
    <div className="flex justify-end space-x-2 flex-wrap gap-2">
      <Button variant="outline" onClick={() => handleTimeRangeSelect(24)}>
        Last 24 Hours
      </Button>
      <Button variant="outline" onClick={() => handleTimeRangeSelect(6)}>
        Last 6 Hours
      </Button>
      <Button variant="outline" onClick={() => handleTimeRangeSelect(3)}>
        Last 3 Hours
      </Button>
      <Button variant="outline" onClick={() => handleTimeRangeSelect(1)}>
        Last 1 Hour
      </Button>
      <Button onClick={onRefresh}>Refresh Data</Button>
    </div>
  )
}

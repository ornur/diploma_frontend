import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateSensorData } from "@/lib/data-generator";
import type { DateRange } from "@/types/sensor";

export function useSensorData() {
  const [selectedSensor, setSelectedSensor] = useState<string>("ActivePower");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date("2025-02-17T01:00:00Z"),
    end: new Date("2025-02-17T02:00:00Z"),
  });


  const fallbackData = useQuery({
    queryKey: [
      "generated-data",
      dateRange.start,
      dateRange.end,
      selectedSensor,
    ],
    queryFn: () =>
      generateSensorData(dateRange.start, dateRange.end, selectedSensor),
  });

  return {
    sensorData : fallbackData,
    selectedSensor,
    setSelectedSensor,
    dateRange,
    setDateRange,
  };
}

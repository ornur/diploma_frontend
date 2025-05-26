import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SensorData, DateRange } from "@/types/sensor";
import { generateSensorData } from "@/lib/data-generator";
import axiosInstance from "@/lib/axios";

export function useSensorData() {
  const [selectedSensor, setSelectedSensor] = useState<string>("ActivePower");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date("2025-02-17T01:00:00Z"),
    end: new Date("2025-02-17T02:00:00Z"),
  });

  const apiData = useQuery({
    queryKey: ["sensor-data", dateRange.start, dateRange.end, selectedSensor],
    queryFn: async (): Promise<SensorData> => {
      const response = await axiosInstance.get<SensorData>(
        `/api/v1/timeseries/${selectedSensor}`,
        {
          params: {
            start_date: dateRange.start.toISOString(),
            end_date: dateRange.end.toISOString(),
          },
        }
      );

      return {
        ...response.data,
        data: response.data.data.map((item) => ({
          ...item,
          timestamp:
            typeof item.timestamp === "string"
              ? new Date(item.timestamp)
              : item.timestamp,
        })),
      };
    },
    retry: 2,
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
    enabled: apiData.isError,
  });

  const sensorData = useMemo(() => {
    return apiData.isError ? fallbackData : apiData;
  }, [apiData, fallbackData]);

  return {
    sensorData,
    selectedSensor,
    setSelectedSensor,
    dateRange,
    setDateRange,
  };
}

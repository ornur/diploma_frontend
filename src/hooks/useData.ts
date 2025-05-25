import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateData2 } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

export type GetData = {
  sensorName: string;
  data: {
    timestamp: Date | string;
    predicted_value: number;
    real_value: number;
    status?: "good" | "warning" | "danger";
  }[];
  message: string;
  thresholds: {
    danger: number;
    warning: number;
    good: number;
  };
};

export function useData() {
  const [selectedSensor, setSelectedSensor] = useState<string>("ActivePower");
  const [date, setDate] = useState<{ start: Date; end: Date }>({
    start: new Date("2025-02-17T01:00:00Z"),
    end: new Date("2025-02-17T02:00:00Z"),
  });

  const apiData = useQuery({
    queryKey: ["api-data", date.start, date.end, selectedSensor],
    queryFn: async () => {
      const response = await axiosInstance.get<GetData>(
        `/api/v1/timeseries/${selectedSensor}`,
        {
          params: {
            start_date: date.start.toISOString(),
            end_date: date.end.toISOString(),
          },
        }
      );


      const processedData = {
        ...response.data,
        data: response.data.data.map((item) => ({
          ...item,
          timestamp:
            typeof item.timestamp === "string"
              ? new Date(item.timestamp)
              : item.timestamp,
          status:
            item.status ||
            (response.data.thresholds
              ? item.real_value >= response.data.thresholds.danger
                ? "danger"
                : item.real_value >= response.data.thresholds.warning
                ? "warning"
                : "good"
              : "good"),
        })),
      };

      return processedData;
    },
    select: (data) => data,
    retry: 3,
  });

  const generatedData = useQuery({
    queryKey: ["generated-data", date.start, date.end, selectedSensor],
    queryFn: () => generateData2(date.start, date.end, selectedSensor),
    enabled: apiData.isError,
  });

  const modelData = useMemo(() => {
    if (apiData.isError) {
      return generatedData;
    }
    return apiData;
  }, [apiData, generatedData]);

  return {
    modelData,
    selectedSensor,
    setSelectedSensor,
    date,
    setDate,
  };
}

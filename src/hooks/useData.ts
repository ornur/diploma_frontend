import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { generateData2 } from "@/lib/utils";

export type GetData = {
  sensorName: string;
  data: {
    timestamp: Date;
    predicted_value: number;
    real_value: number;
  }[];
  message: string;
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
      const response = await axiosInstance.get<GetData>(`/api/v1/timeseries/${selectedSensor}`, {
        params: {
          start_date: date.start.toISOString(),
          end_date: date.end.toISOString(),
        }
      });
      return response.data;
    },
    select: data => data,
    retry: 3,
  });

  const generatedData = useQuery({
    queryKey: ["generated-data", date.start, date.end, selectedSensor],
    queryFn: () => generateData2(date.start, date.end, selectedSensor),
    enabled: apiData.isError,
  });

  const modelData = useMemo(() => {
    if (apiData.isError) {
      console.log("API data error, using generated data", apiData.error);
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

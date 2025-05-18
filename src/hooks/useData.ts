import { useState } from "react";
import { subHours } from "date-fns/subHours";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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
  const now = new Date();
  const [selectedSensor, setSelectedSensor] = useState<string>("ActivePower");
  const [date, setDate] = useState<{ start: Date; end: Date }>({
    start: new Date(2025, 0, 25, 8, 1, 0),
    end: new Date(2025, 0, 25, 9, 0, 0),
  });

  const modelData = useQuery({
    queryKey: ["data", date.start, date.end, selectedSensor],
    //queryFn: () => generateData2(date.start, date.end, selectedSensor),
    queryFn: () => axiosInstance.get<GetData>(`/api/v1/timeseries/${selectedSensor}`, {
      params: {
        start_date: date.start.toISOString(),
        end_date: date.end.toISOString(),
      }
    }),
    select: data => data.data 
  });
  return { modelData, selectedSensor, setSelectedSensor, date, setDate, now };
}

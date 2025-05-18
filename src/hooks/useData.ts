import { useState } from "react";
import { subHours } from "date-fns/subHours";
import { useQuery } from "@tanstack/react-query";
import { generateData2 } from "@/lib/utils";
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
  const [selectedSensor, setSelectedSensor] = useState<string>("ap");
  const [date, setDate] = useState<{ start: Date; end: Date }>({
    start: subHours(now, 1),
    end: now,
  });

  const modelData = useQuery({
    queryKey: ["data", date.start, date.end, selectedSensor],
    queryFn: () => generateData2(date.start, date.end, selectedSensor),
    // queryFn: () => axiosInstance.get<GetData>("/api/data"),
  });
  return { modelData, selectedSensor, setSelectedSensor, date, setDate, now };
}

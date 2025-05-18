import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const modelData = useQuery({
    queryKey: ["data", date.start, date.end, selectedSensor],
    queryFn: () => generateData2(date.start, date.end, selectedSensor),
  });
  return { modelData, selectedSensor, setSelectedSensor, date, setDate};
}

"use client";

import { useData } from "@/hooks/useData";
import { SENSOR_COLUMNS } from "./config";
import { StartDatePicker, EndDatePicker, SensorPicker, SelectTimeButtons } from "./date-picker";
import { ChartDisplay } from "./ChartDisplay";

export function DynamicLineChart() {
  const { modelData, selectedSensor, date, setDate, setSelectedSensor } = useData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StartDatePicker date={date} setDate={setDate} />
        <EndDatePicker date={date} setDate={setDate} />
      </div>

      <SensorPicker
        selectedSensor={selectedSensor}
        setSelectedSensor={setSelectedSensor}
        sensors={SENSOR_COLUMNS}
      />
      <SelectTimeButtons modelData={modelData} date={date} setDate={setDate} />
      <ChartDisplay modelData={modelData} selectedSensor={selectedSensor} />
    </div>
  );
}
"use client";

import { useSensorData } from "@/hooks/useSensorData";
import { SENSOR_COLUMNS } from "@/config/sensors";
import { DateTimePicker } from "@/components/composed-chart/date-time-picker";
import { SensorSelector } from "@/components/composed-chart/sensor-selector";
import { TimeRangeButtons } from "@/components/composed-chart/time-range-buttons";
import { ChartDisplay } from "@/components/composed-chart/ChartDisplay";
import { ZoneLegend } from "@/components/composed-chart/zone-legend";

export function SensorChart() {
  const {
    sensorData,
    selectedSensor,
    setSelectedSensor,
    dateRange,
    setDateRange,
  } = useSensorData();

  const handleStartDateChange = (start: Date) => {
    setDateRange({ ...dateRange, start });
  };

  const handleEndDateChange = (end: Date) => {
    setDateRange({ ...dateRange, end });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimePicker
          date={dateRange.start}
          onDateChange={handleStartDateChange}
          label="Start Date"
        />
        <DateTimePicker
          date={dateRange.end}
          onDateChange={handleEndDateChange}
          label="End Date"
        />
      </div>

      <SensorSelector
        sensors={SENSOR_COLUMNS}
        selectedSensor={selectedSensor}
        onSensorChange={setSelectedSensor}
      />

      <TimeRangeButtons
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={() => sensorData.refetch()}
      />

      <div className="flex flex-col gap-4">
        <div className="lg:col-span-3">
          <ChartDisplay
            sensorData={sensorData}
            selectedSensor={selectedSensor}
          />
        </div>
        <div className="lg:col-span-1">
          <ZoneLegend />
        </div>
      </div>
    </div>
  );
}

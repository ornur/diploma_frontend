"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useData } from "@/hooks/useData";
import { SENSOR_COLUMNS, getSensorColor } from "./config";
import {
  EndDatePicker,
  SelectTimeButtons,
  SensorPicker,
  StartDatePicker,
} from "./date-picker";

export function DynamicLineChart() {
  const { modelData, selectedSensor, date, now, setDate, setSelectedSensor } =
    useData();
  // Find min and max values for Y-axis for each sensor
  const getYAxisDomain = () => {
    if (!modelData.data) return [0, 100];
    if (modelData.data.data.length === 0) return [0, 100];

    const min = Math.min(
      ...modelData.data.data.map((v) => v.real_value),
      ...modelData.data.data.map((v) => v.predicted_value)
    );
    const max = Math.max(
      ...modelData.data.data.map((v) => v.real_value),
      ...modelData.data.data.map((v) => v.predicted_value)
    );
    const padding = (max - min) * 0.1 || 10;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  const getChartConfig = () => {
    const config: Record<string, { label: string; color: string }> = {};
    const selectedSensors = SENSOR_COLUMNS.filter(
      (s) => s.id === selectedSensor
    );
    selectedSensors.forEach((sensor) => {
      config[sensor.id] = {
        label: sensor.name,
        color: getSensorColor(sensor.id, false),
      };
    });
    return config;
  };

  // Get unit for sensor
  const getSensorUnit = (sensorId: string) => {
    const sensor = SENSOR_COLUMNS.find((s) => s.id === sensorId);
    return sensor ? sensor.unit : "";
  };

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
      <SelectTimeButtons modelData={modelData} now={now} setDate={setDate} />

      {modelData.isSuccess ? (
        <ChartContainer
          key={modelData.data?.sensorName}
          config={getChartConfig()}
          className="min-h-[400px]"
        >
          <LineChart
            accessibilityLayer
            data={modelData.data?.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) => format(new Date(date), "HH:mm")}
              domain={["dataMin", "dataMax"]}
              label={{ value: "Time", position: "insideBottom", offset: -10 }}
            />

            <YAxis
              key={selectedSensor}
              yAxisId={selectedSensor}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={getYAxisDomain()}
              orientation="left"
              label={{
                value: `${
                  SENSOR_COLUMNS.find((s) => s.id === selectedSensor)?.name
                } (${getSensorUnit(selectedSensor)})`,
                angle: -90,
                position: "insideLeft",
                style: { fill: getSensorColor(selectedSensor, false) },
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelKey={selectedSensor}
                />
              }
            />

            <Line
              type="monotone"
              dataKey="predicted_value"
              stroke={getSensorColor(selectedSensor, true)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />

            <Line
              type="linear"
              dataKey="real_value"
              stroke={getSensorColor(selectedSensor, false)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            {modelData.isPending
              ? "Loading..."
              : modelData.isError
              ? "Error loading data"
              : "No data available"}
          </p>
        </div>
      )}
    </div>
  );
}

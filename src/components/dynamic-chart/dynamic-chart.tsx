"use client";

import { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, subHours } from "date-fns";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  EndDatePicker,
  SelectTimeButtons,
  SensorPicker,
  StartDatePicker,
} from "./date-picker";
import { generateData } from "@/lib/utils";

// Available sensors
const sensors = [
  { id: "temp", name: "Temperature", unit: "°C" },
  { id: "humidity", name: "Humidity", unit: "%" },
  { id: "pressure", name: "Pressure", unit: "hPa" },
  { id: "co2", name: "CO2", unit: "ppm" },
  { id: "voc", name: "VOC", unit: "ppb" },
];

export function DynamicLineChart() {
  const now = new Date();
  const [date, setDate] = useState<{ start: Date; end: Date }>({
    start: subHours(now, 1),
    end: now,
  });
  const [selectedSensor, setSelectedSensor] = useState<string>("temp");

  const [data, setData] = useState(() =>
    generateData(date.start, date.end, selectedSensor)
  );

  // Update data when time range or sensors change
  useEffect(() => {
    setData(generateData(date.start, date.end, selectedSensor));
  }, [date.start, date.end, selectedSensor]);

  // Find min and max values for Y-axis for each sensor
  const getYAxisDomain = (sensorId: string) => {
    const values = data
      .flatMap((item) => [
        item[`${sensorId}_real`],
        item[`${sensorId}_predicted`],
      ])
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) return [0, 100];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 10;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  // Get chart config for selected sensors
  const getChartConfig = () => {
    const config: Record<string, { label: string; color: string }> = {};

    const sensor = sensors.find((s) => s.id === selectedSensor);
    if (sensor) {
      config[`${selectedSensor}_predicted`] = {
        label: `${sensor.name} (Predicted)`,
        color: getSensorColor(selectedSensor, true),
      };
      config[`${selectedSensor}_real`] = {
        label: `${sensor.name} (Real)`,
        color: getSensorColor(selectedSensor, false),
      };
    }
    return config;
  };

  // Get color for sensor
  const getSensorColor = (sensorId: string, isPredicted: boolean) => {
    const baseColors = {
      temp: isPredicted ? "hsl(0, 51.30%, 68.60%)" : "hsl(0, 90%, 45%)",
      humidity: isPredicted ? "hsl(200, 52.90%, 70.00%)" : "hsl(200, 90%, 45%)",
      pressure: isPredicted ? "hsl(270, 52.40%, 67.80%)" : "hsl(270, 90%, 45%)",
      co2: isPredicted ? "hsl(120, 48.00%, 70.60%)" : "hsl(120, 90%, 45%)",
      voc: isPredicted ? "hsl(40, 71.00%, 72.90%)" : "hsl(40, 90%, 45%)",
    };

    return (
      baseColors[sensorId as keyof typeof baseColors] ||
      (isPredicted ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))")
    );
  };

  // Get unit for sensor
  const getSensorUnit = (sensorId: string) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.unit : "";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StartDatePicker date={date} setDate={setDate} />
        <EndDatePicker date={date} setDate={setDate} />
      </div>

      <SensorPicker
        sensors={sensors}
        selectedSensor={selectedSensor}
        setSelectedSensor={setSelectedSensor}
      />
      <SelectTimeButtons
        now={now}
        date={date}
        selectedSensor={selectedSensor}
        setDate={setDate}
        setData={setData}
      />

      {selectedSensor.length > 0 ? (
        <ChartContainer config={getChartConfig()} className="min-h-[400px]">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 40,
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
              domain={getYAxisDomain(selectedSensor)}
              orientation="left"
              label={{
                value: `${
                  sensors.find((s) => s.id === selectedSensor)?.name
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
                  indicator="dot"
                  formatter={(value, name) => {
                    const [sensorId, type] =
                      typeof name === "string" ? name.split("_") : ["", ""];
                    const sensor = sensors.find((s) => s.id === sensorId);
                    return [
                      `${value} ${getSensorUnit(sensorId)} `,
                      `${sensor?.name} (${
                        type === "predicted" ? "Predicted" : "Real"
                      })`,
                    ];
                  }}
                />
              }
            />

            <Line
              key={`${selectedSensor}_predicted`}
              type="monotone"
              dataKey={`${selectedSensor}_predicted`}
              stroke={getSensorColor(selectedSensor, true)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />

            <Line
              key={`${selectedSensor}_real`}
              type="linear"
              dataKey={`${selectedSensor}_real`}
              stroke={getSensorColor(selectedSensor, false)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Please select at least one sensor to display data
          </p>
        </div>
      )}
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GenerateData2 = {
  sensorName: string;
  data: {
    timestamp: Date;
    predicted_value: number;
    real_value: number;
    status: "good" | "warning" | "danger";
  }[];
  message: string;
  thresholds: {
    danger: number;
    warning: number;
    good: number;
  };
};

export const generateData2 = (
  start: Date,
  end: Date,
  selectedSensor: string
): GenerateData2 => {
  const thresholds: Record<
    string,
    { danger: number; warning: number; good: number }
  > = {
    temp: { danger: 30, warning: 26, good: 22 },
    humidity: { danger: 70, warning: 60, good: 50 },
    pressure: { danger: 1030, warning: 1020, good: 1013 },
    co2: { danger: 800, warning: 600, good: 400 },
    voc: { danger: 200, warning: 150, good: 100 },
    ActivePower: { danger: 300, warning: 200, good: 100 },
    // Add defaults for any other sensor
    default: { danger: 80, warning: 60, good: 40 },
  };

  const sensorThresholds = thresholds[selectedSensor] || thresholds.default;

  const generatedData: GenerateData2 = {
    sensorName: selectedSensor,
    data: [],
    message: "",
    thresholds: sensorThresholds,
  };

  const timeRange = end.getTime() - start.getTime();
  const dataPoints = 30;
  const interval = timeRange / (dataPoints - 1);

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(start.getTime() + i * interval);
    let baseValue = 0;

    switch (selectedSensor) {
      case "temp":
        baseValue = 22 + 3 * Math.sin(i / 5);
        break;
      case "humidity":
        baseValue = 45 + 15 * Math.sin(i / 8);
        break;
      case "pressure":
        baseValue = 1013 + 5 * Math.sin(i / 10);
        break;
      case "co2":
        baseValue = 400 + 100 * Math.sin(i / 6);
        break;
      case "voc":
        baseValue = 100 + 50 * Math.sin(i / 4);
        break;
      case "ActivePower":
        baseValue = 150 + 100 * Math.sin(i / 7);
        break;
      default:
        baseValue = 50 + 30 * Math.sin(i / 6);
    }

    const predictedValue = Math.round(baseValue + (Math.random() - 0.5) * 5);
    const realValue = Math.round(baseValue + (Math.random() - 0.5) * 10);

    let status: "good" | "warning" | "danger" = "good";

    const timeBasedVariation = Math.sin(i / 3) * 10;
    const adjustedValue = realValue + timeBasedVariation;

    if (adjustedValue >= sensorThresholds.danger) {
      status = "danger";
    } else if (adjustedValue >= sensorThresholds.warning) {
      status = "warning";
    }

    if (i >= 10 && i <= 15) {
      status = "danger";
    } else if (i >= 20 && i <= 22) {
      status = "warning";
    }

    generatedData.data.push({
      timestamp,
      predicted_value: predictedValue,
      real_value: realValue,
      status: status,
    });
  }

  return generatedData;
};
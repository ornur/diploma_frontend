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
  }[];
  message: string;
};

export const generateData2 = (
  start: Date,
  end: Date,
  selectedSensor: string
): GenerateData2 => {
  const generatedData: GenerateData2 = {
    sensorName: selectedSensor,
    data: [],
    message: "",
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
    }

    // Add real and predicted values with some variation
    generatedData.data.push({
      timestamp,
      predicted_value: Math.round(baseValue + (Math.random() - 0.5) * 5),
      real_value: Math.round(baseValue + (Math.random() - 0.5) * 10),
    });
  }

  return generatedData;
};

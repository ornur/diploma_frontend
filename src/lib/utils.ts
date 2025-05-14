import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateData = (
  start: Date,
  end: Date,
  selectedSensor: string
): { [key: string]: number | string }[] => {
  const data = [];
  const timeRange = end.getTime() - start.getTime();
  const dataPoints = 30;
  const interval = timeRange / (dataPoints - 1);

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(start.getTime() + i * interval);
    const dataPoint: any = { timestamp };

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
    dataPoint[`${selectedSensor}_real`] = Math.round(
      baseValue + (Math.random() - 0.5) * 5
    );
    dataPoint[`${selectedSensor}_predicted`] = Math.round(
      baseValue + (Math.random() - 0.5) * 10
    );
    data.push(dataPoint);
  }

  return data;
};

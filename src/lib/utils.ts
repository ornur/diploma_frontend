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
    ActivePower: { danger: 300, warning: 200, good: 100 },
    ReactivePower: { danger: 200, warning: 150, good: 100 },
    MetalOutputIntensity: { danger: 400, warning: 300, good: 200 },
    PowerSetpoint: { danger: 500, warning: 400, good: 250 },
    FurnacePodTemparature: { danger: 40, warning: 30, good: 20 },
    FurnaceBathTemperature: { danger: 45, warning: 35, good: 25 },
    ReleaseAmountA: { danger: 50, warning: 40, good: 30 },
    ReleaseAmountB: { danger: 50, warning: 40, good: 30 },
    ReleaseAmountC: { danger: 50, warning: 40, good: 30 },
    UpperRingRaiseA: { danger: 10, warning: 8, good: 5 },
    UpperRingRaiseB: { danger: 10, warning: 8, good: 5 },
    UpperRingRaiseC: { danger: 10, warning: 8, good: 5 },
    UpperRingReleaseA: { danger: 10, warning: 8, good: 5 },
    UpperRingReleaseB: { danger: 10, warning: 8, good: 5 },
    UpperRingReleaseC: { danger: 10, warning: 8, good: 5 },
    GasPressureUnderFurnaceA: { danger: 120, warning: 100, good: 80 },
    GasPressureUnderFurnaceB: { danger: 120, warning: 100, good: 80 },
    GasPressureUnderFurnaceC: { danger: 120, warning: 100, good: 80 },
    PowerA: { danger: 300, warning: 200, good: 100 },
    PowerB: { danger: 300, warning: 200, good: 100 },
    PowerC: { danger: 300, warning: 200, good: 100 },
    HighVoltageA: { danger: 450, warning: 400, good: 350 },
    HighVoltageB: { danger: 450, warning: 400, good: 350 },
    HighVoltageC: { danger: 450, warning: 400, good: 350 },
    LowerRingReleaseA: { danger: 10, warning: 8, good: 5 },
    LowerRingReleaseB: { danger: 10, warning: 8, good: 5 },
    LowerRingReleaseC: { danger: 10, warning: 8, good: 5 },
    VentialtionValveForMantelA: { danger: 100, warning: 80, good: 60 },
    VentialtionValveForMantelB: { danger: 100, warning: 80, good: 60 },
    VentialtionValveForMantelC: { danger: 100, warning: 80, good: 60 },
    VoltageStepA: { danger: 20, warning: 15, good: 10 },
    VoltageStepB: { danger: 20, warning: 15, good: 10 },
    VoltageStepC: { danger: 20, warning: 15, good: 10 },
    CurrentHolderPositionA: { danger: 20, warning: 15, good: 10 },
    CurrentHolderPositionB: { danger: 20, warning: 15, good: 10 },
    CurrentHolderPositionC: { danger: 20, warning: 15, good: 10 },
    HolderModeA: { danger: 2, warning: 1, good: 0 },
    HolderModeB: { danger: 2, warning: 1, good: 0 },
    HolderModeC: { danger: 2, warning: 1, good: 0 },
    AirTemperatureMantelA: { danger: 30, warning: 25, good: 20 },
    AirTemperatureMantelB: { danger: 30, warning: 25, good: 20 },
    AirTemperatureMantelC: { danger: 30, warning: 25, good: 20 },
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
    const sensorType = selectedSensor.replace(/[ABC]$/, ""); // Remove A/B/C suffix
    const phaseValue = selectedSensor.endsWith("A")
      ? 0
      : selectedSensor.endsWith("B")
      ? 2
      : selectedSensor.endsWith("C")
      ? 4
      : 0;

    switch (sensorType) {
      case "ActivePower":
        baseValue = 150 + 100 * Math.sin((i + phaseValue) / 7);
        break;
      case "ReactivePower":
        baseValue = 100 + 50 * Math.sin((i + phaseValue) / 5);
        break;
      case "MetalOutputIntensity":
        baseValue = 200 + 100 * Math.sin((i + phaseValue) / 4);
        break;
      case "PowerSetpoint":
        baseValue = 250 + 150 * Math.sin((i + phaseValue) / 6);
        break;
      case "FurnacePodTemparature":
        baseValue = 25 + 10 * Math.sin((i + phaseValue) / 3);
        break;
      case "FurnaceBathTemperature":
        baseValue = 30 + 15 * Math.sin((i + phaseValue) / 4);
        break;
      case "ReleaseAmount":
        baseValue = 20 + 10 * Math.sin((i + phaseValue) / 2);
        break;
      case "UpperRingRaise":
        baseValue = 5 + 2 * Math.sin((i + phaseValue) / 3);
        break;
      case "UpperRingRelease":
        baseValue = 3 + 1 * Math.sin((i + phaseValue) / 2);
        break;
      case "GasPressureUnderFurnace":
        baseValue = 100 + 20 * Math.sin((i + phaseValue) / 4);
        break;
      case "Power":
        baseValue = 150 + 80 * Math.sin((i + phaseValue) / 5);
        break;
      case "HighVoltage":
        baseValue = 400 + 50 * Math.sin((i + phaseValue) / 6);
        break;
      case "LowerRingRelease":
        baseValue = 4 + 1 * Math.sin((i + phaseValue) / 2);
        break;
      case "VentialtionValveForMantel":
        baseValue = 50 + 20 * Math.sin((i + phaseValue) / 3);
        break;
      case "VoltageStep":
        baseValue = 10 + 5 * Math.sin((i + phaseValue) / 2);
        break;
      case "CurrentHolderPosition":
        baseValue = 15 + 5 * Math.sin((i + phaseValue) / 3);
        break;
      case "HolderMode":
        baseValue = 1 + Math.sin((i + phaseValue) / 2);
        break;
      case "AirTemperatureMantel":
        baseValue = 22 + 5 * Math.sin((i + phaseValue) / 3);
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
    });
  }

  console.log(generatedData);

  return generatedData;
};

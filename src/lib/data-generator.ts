import type { SensorData, SensorDataPoint } from "@/types/sensor";
import {
  calculatePercentageDeviation,
  getPercentageZoneColor,
} from "./chart-utils";
import { PERCENTAGE_THRESHOLDS } from "@/config/sensors";

export function generateSensorData(
  start: Date,
  end: Date,
  selectedSensor: string
): SensorData {
  const timeRange = end.getTime() - start.getTime();
  const dataPoints = 30;
  const interval = timeRange / (dataPoints - 1);
  const data: SensorDataPoint[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(start.getTime() + i * interval);
    const baseValue = calculateBaseValue(selectedSensor, i);

    const predictedValue = Math.round(baseValue + (Math.random() - 0.5) * 5);
    const realValue = Math.round(baseValue + (Math.random() - 0.5) * 10);
    const deviationPercent = calculatePercentageDeviation(
      predictedValue,
      realValue
    );

    const spectre_color = getPercentageZoneColor(deviationPercent);

    data.push({
      timestamp,
      predicted_value: predictedValue,
      real_value: realValue,
      spectre_color,
    });
  }

  return {
    sensorName: selectedSensor,
    data,
    message: "Generated data with percentage-based zones",
    thresholds: {
      maxGoodDeviation: PERCENTAGE_THRESHOLDS.goodDeviationPercent,
      maxWarningDeviation: PERCENTAGE_THRESHOLDS.warningDeviationPercent,
    },
  };
}

function calculateBaseValue(selectedSensor: string, index: number): number {
  const sensorType = selectedSensor.replace(/[ABC]$/, "");
  const phaseValue = selectedSensor.endsWith("A")
    ? 0
    : selectedSensor.endsWith("B")
    ? 2
    : selectedSensor.endsWith("C")
    ? 4
    : 0;

  const sensorBaseValues: Record<string, () => number> = {
    ActivePower: () => 150 + 100 * Math.sin((index + phaseValue) / 7),
    ReactivePower: () => 100 + 50 * Math.sin((index + phaseValue) / 5),
    MetalOutputIntensity: () => 200 + 100 * Math.sin((index + phaseValue) / 4),
    PowerSetpoint: () => 250 + 150 * Math.sin((index + phaseValue) / 6),
    FurnacePodTemparature: () => 25 + 10 * Math.sin((index + phaseValue) / 3),
    FurnaceBathTemperature: () => 30 + 15 * Math.sin((index + phaseValue) / 4),
    ReleaseAmount: () => 20 + 10 * Math.sin((index + phaseValue) / 2),
    UpperRingRaise: () => 5 + 2 * Math.sin((index + phaseValue) / 3),
    UpperRingRelease: () => 3 + 1 * Math.sin((index + phaseValue) / 2),
    GasPressureUnderFurnace: () =>
      100 + 20 * Math.sin((index + phaseValue) / 4),
    Power: () => 150 + 80 * Math.sin((index + phaseValue) / 5),
    HighVoltage: () => 400 + 50 * Math.sin((index + phaseValue) / 6),
    LowerRingRelease: () => 4 + 1 * Math.sin((index + phaseValue) / 2),
    VentialtionValveForMantel: () =>
      50 + 20 * Math.sin((index + phaseValue) / 3),
    VoltageStep: () => 10 + 5 * Math.sin((index + phaseValue) / 2),
    CurrentHolderPosition: () => 15 + 5 * Math.sin((index + phaseValue) / 3),
    HolderMode: () => 1 + Math.sin((index + phaseValue) / 2),
    AirTemperatureMantel: () => 22 + 5 * Math.sin((index + phaseValue) / 3),
  };

  const calculator = sensorBaseValues[sensorType];
  return calculator ? calculator() : 50 + 30 * Math.sin(index / 6);
}

import type { ChartConfig } from "@/types/chart";
import { SENSOR_COLUMNS, PERCENTAGE_THRESHOLDS } from "@/config/sensors";

const SENSOR_COLOR_MAP = {
  ap: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  rp: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  moi: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  ps: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  fpt: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  fbt: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  raa: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  rab: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  rac: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  urra: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  urrb: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  urrc: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  ura: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  urb: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  urc: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  gpufa: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  gpufb: {
    predicted: "hsl(200, 52.90%, 70.00%)",
    actual: "hsl(200, 90%, 45%)",
  },
  gpufc: {
    predicted: "hsl(270, 52.40%, 67.80%)",
    actual: "hsl(270, 90%, 45%)",
  },
  pa: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  pb: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  pc: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  hva: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  hvb: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  hvc: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  lrra: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  lrrb: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  lrrc: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  vvfma: {
    predicted: "hsl(270, 52.40%, 67.80%)",
    actual: "hsl(270, 90%, 45%)",
  },
  vvfmb: {
    predicted: "hsl(120, 48.00%, 70.60%)",
    actual: "hsl(120, 90%, 45%)",
  },
  vvfmc: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  vsa: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  vsb: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
  vsc: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  chpa: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  chpb: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  chpc: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  hmb: { predicted: "hsl(270, 52.40%, 67.80%)", actual: "hsl(270, 90%, 45%)" },
  hmc: { predicted: "hsl(120, 48.00%, 70.60%)", actual: "hsl(120, 90%, 45%)" },
  atma: { predicted: "hsl(40, 71.00%, 72.90%)", actual: "hsl(40, 90%, 45%)" },
  atmb: { predicted: "hsl(0, 51.30%, 68.60%)", actual: "hsl(0, 90%, 45%)" },
  atmc: { predicted: "hsl(200, 52.90%, 70.00%)", actual: "hsl(200, 90%, 45%)" },
} as const;

export function getSensorColor(sensorId: string, isPredicted: boolean): string {
  const colorKey = sensorId.toLowerCase() as keyof typeof SENSOR_COLOR_MAP;
  const colors = SENSOR_COLOR_MAP[colorKey];

  if (!colors) {
    return isPredicted ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))";
  }

  return isPredicted ? colors.predicted : colors.actual;
}

export function getSensorUnit(sensorId: string): string {
  const sensor = SENSOR_COLUMNS.find((s) => s.id === sensorId);
  return sensor?.unit ?? "";
}

export function createChartConfig(selectedSensor: string): ChartConfig {
  const config: ChartConfig = {};
  const selectedSensors = SENSOR_COLUMNS.filter((s) => s.id === selectedSensor);

  selectedSensors.forEach((sensor) => {
    config[sensor.id] = {
      label: sensor.name,
      color: getSensorColor(sensor.id, false),
    };
  });

  return config;
}

export function calculatePercentageDeviation(
  predicted: number,
  actual: number
): number {
  if (predicted === 0) return actual === 0 ? 0 : 100;
  return Math.abs((actual - predicted) / predicted) * 100;
}

export function getPercentageZoneColor(deviationPercent: number): string {
  const { goodDeviationPercent, warningDeviationPercent } =
    PERCENTAGE_THRESHOLDS;

  if (deviationPercent <= goodDeviationPercent) {
    return "rgba(0, 255, 0, 0.3)";
  } else if (deviationPercent <= warningDeviationPercent) {
    return "rgba(255, 238, 0, 0.3)";
  } else {
    return "rgba(255, 0, 0, 0.3)";
  }
}

export function calculatePercentageBounds(predictedValue: number) {
  const { goodDeviationPercent, warningDeviationPercent } =
    PERCENTAGE_THRESHOLDS;

  const goodDeviation = Math.abs(predictedValue * (goodDeviationPercent / 100));
  const warningDeviation = Math.abs(
    predictedValue * (warningDeviationPercent / 100)
  );

  return {
    good_lower_bound: predictedValue - goodDeviation,
    good_upper_bound: predictedValue + goodDeviation,
    warning_lower_bound: predictedValue - warningDeviation,
    warning_upper_bound: predictedValue + warningDeviation,
  };
}

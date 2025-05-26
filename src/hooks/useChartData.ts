"use client";

import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { SensorData } from "@/types/sensor";
import type { ChartDataPoint } from "@/types/chart";
import {
  createChartConfig,
  getSensorUnit,
  calculatePercentageDeviation,
} from "@/lib/chart-utils";
import { PERCENTAGE_THRESHOLDS } from "@/config/sensors";

interface UseChartDataProps {
  sensorData: UseQueryResult<SensorData>;
  selectedSensor: string;
}

export function useChartData({
  sensorData,
  selectedSensor,
}: UseChartDataProps) {
  const chartConfig = useMemo(
    () => createChartConfig(selectedSensor),
    [selectedSensor]
  );

  const yAxisDomain = useMemo(() => {
    if (!sensorData.data?.data) return [0, 100];

    const values = sensorData.data.data.flatMap((item) => [
      item.real_value,
      item.predicted_value,
    ]);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.15 || 10;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [sensorData.data]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!sensorData.data?.data) return [];

    const { goodDeviationPercent, warningDeviationPercent } =
      PERCENTAGE_THRESHOLDS;
    const [minY, maxY] = yAxisDomain;

    return sensorData.data.data.map((item) => {
      const timestamp = new Date(item.timestamp).getTime();
      const predicted = item.predicted_value;
      const actual = item.real_value;

      // Calculate percentage deviation between actual and predicted
      const deviationPercent = calculatePercentageDeviation(predicted, actual);

      // Calculate reference bounds around predicted value for visualization
      const goodDeviation = Math.abs(predicted * (goodDeviationPercent / 100));
      const warningDeviation = Math.abs(
        predicted * (warningDeviationPercent / 100)
      );

      return {
        timestamp,
        predicted_value: predicted,
        real_value: actual,
        deviation_percent: deviationPercent,
        good_bound: [actual - goodDeviation, actual + goodDeviation],
        warning_bound: [actual - warningDeviation, actual + warningDeviation],
        chart_y: [
          Math.min(minY),
          Math.max(maxY),
        ],
      };
    });
  }, [sensorData.data, yAxisDomain]);

  return {
    chartData,
    chartConfig,
    yAxisDomain,
    getSensorUnit: (sensorId: string) => getSensorUnit(sensorId),
  };
}

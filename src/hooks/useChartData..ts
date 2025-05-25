import { useMemo } from "react";
import { getSensorColor, SENSOR_COLUMNS } from "@/components/dynamic-chart/config";

interface Thresholds {
  danger: number;
  warning: number;
  good: number;
}

interface DataItem {
  timestamp: string | Date;
  real_value: number;
  predicted_value: number;
  status?: "good" | "warning" | "danger";
}

interface ModelData {
  data: {
    data: DataItem[];
    thresholds?: Thresholds;
    sensorName?: string;
  }| undefined;
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
}

export function useChartData(modelData: ModelData, selectedSensor: string) {
  const calculateStatus = (value: number, thresholds: Thresholds) => {
    if (value >= thresholds.danger) return "danger";
    if (value >= thresholds.warning) return "warning";
    return "good";
  };

  const processedData = useMemo(() => {
    return (
      modelData.data?.data?.map((item) => {
        const timestamp =
          typeof item.timestamp === "string"
            ? new Date(item.timestamp)
            : item.timestamp;
        let status = item.status;

        if (!status && modelData.data?.thresholds) {
          status = calculateStatus(item.real_value, modelData.data.thresholds);
        }

        return {
          ...item,
          timestamp,
          status: status || "good",
        };
      }) || []
    );
  }, [modelData.data]);

  const getYAxisDomain = useMemo(() => {
    if (!modelData.data || processedData.length === 0) return [0, 100];

    let min = Math.min(
      ...processedData.map((v) => v.real_value),
      ...processedData.map((v) => v.predicted_value)
    );

    let max = Math.max(
      ...processedData.map((v) => v.real_value),
      ...processedData.map((v) => v.predicted_value)
    );

    if (modelData.data.thresholds) {
      min = Math.min(
        min,
        modelData.data.thresholds.good,
        modelData.data.thresholds.warning,
        modelData.data.thresholds.danger
      );

      max = Math.max(
        max,
        modelData.data.thresholds.good,
        modelData.data.thresholds.warning,
        modelData.data.thresholds.danger
      );
    }

    const padding = (max - min) * 0.15 || 10;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [modelData.data, processedData]);

  const getChartConfig = useMemo(() => {
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
  }, [selectedSensor]);

  const getSensorUnit = (sensorId: string) => {
    const sensor = SENSOR_COLUMNS.find((s) => s.id === sensorId);
    return sensor ? sensor.unit : "";
  };

  const getTimePeriods = useMemo(() => {
    if (!processedData || processedData.length === 0) return [];

    const periods: Array<{
      start: Date;
      end: Date;
      status: "good" | "warning" | "danger";
    }> = [];

    let currentStatus = processedData[0].status;
    let periodStart = processedData[0].timestamp;

    for (let i = 1; i < processedData.length; i++) {
      if (processedData[i].status !== currentStatus) {
        periods.push({
          start: periodStart as Date,
          end: processedData[i - 1].timestamp as Date,
          status: currentStatus,
        });

        currentStatus = processedData[i].status;
        periodStart = processedData[i].timestamp;
      }
    }

    periods.push({
      start: periodStart as Date,
      end: processedData[processedData.length - 1].timestamp as Date,
      status: currentStatus,
    });

    return periods;
  }, [processedData]);

  return {
    processedData,
    getTimePeriods,
    getYAxisDomain,
    getChartConfig,
    getSensorUnit,
  };
}
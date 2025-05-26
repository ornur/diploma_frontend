import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { UseQueryResult } from "@tanstack/react-query";
import type { SensorData } from "@/types/sensor";
import { useChartData } from "@/hooks/useChartData";
import {
  getSensorColor,
  calculatePercentageDeviation,
} from "@/lib/chart-utils";
import { SENSOR_COLUMNS, PERCENTAGE_THRESHOLDS } from "@/config/sensors";

interface ChartDisplayProps {
  sensorData: UseQueryResult<SensorData>;
  selectedSensor: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const predictedData = payload.find(
      (p: any) => p.dataKey === "predicted_value"
    );
    const actualData = payload.find((p: any) => p.dataKey === "real_value");

    if (predictedData && actualData) {
      const deviationPercent = calculatePercentageDeviation(
        predictedData.value,
        actualData.value
      );
      const { goodDeviationPercent, warningDeviationPercent } =
        PERCENTAGE_THRESHOLDS;

      let zoneStatus = "Good";
      if (deviationPercent > warningDeviationPercent) {
        zoneStatus = "Critical";
      } else if (deviationPercent > goodDeviationPercent) {
        zoneStatus = "Warning";
      }

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium mb-2">
            {format(new Date(label), "PPP HH:mm")}
          </p>
          <p className="text-sm" style={{ color: predictedData.color }}>
            Predicted: {predictedData.value?.toFixed(2)}
          </p>
          <p className="text-sm" style={{ color: actualData.color }}>
            Actual: {actualData.value?.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Deviation: {deviationPercent.toFixed(1)}% ({zoneStatus})
          </p>
        </div>
      );
    }
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  const filteredPayload = payload?.filter(
    (item: any) =>
      item.dataKey === "predicted_value" || item.dataKey === "real_value"
  );

  return (
    <div className="flex justify-center space-x-6 mt-4">
      {filteredPayload?.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center space-x-2">
          <div className="w-3 h-0.5" style={{ backgroundColor: entry.color }} />
          <span className="text-sm">
            {entry.dataKey === "predicted_value" ? "Predicted" : "Actual"}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom component to render dynamic background zones
const DynamicBackgroundZones = ({ data, yAxisDomain }: any) => {
  if (!data || data.length === 0) return null;

  return (
    <g>
      {data.map((item: any, index: number) => {
        const nextItem = data[index + 1];
        const x = item.timestamp;
        const width = nextItem ? nextItem.timestamp - item.timestamp : 3600000; // 1 hour default
        const y = yAxisDomain[0];
        const height = yAxisDomain[1] - yAxisDomain[0];

        return (
          <rect
            key={`zone-${index}`}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={item.zone_color}
            style={{ pointerEvents: "none" }}
          />
        );
      })}
    </g>
  );
};

export function ChartDisplay({
  sensorData,
  selectedSensor,
}: ChartDisplayProps) {
  const { chartData, chartConfig, yAxisDomain, getSensorUnit } = useChartData({
    sensorData,
    selectedSensor,
  });

  if (sensorData.isPending) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (sensorData.isError) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">Error loading data</p>
      </div>
    );
  }

  if (!sensorData.data || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const sensorName =
    SENSOR_COLUMNS.find((s) => s.id === selectedSensor)?.name || selectedSensor;

  return (
    <ChartContainer
      key={sensorData.data.sensorName}
      config={chartConfig}
      className="min-h-[400px]"
    >
      <ComposedChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 0,
          right: 40,
          left: 20,
          bottom: 60,
        }}
      >

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")}
          domain={["dataMin", "dataMax"]}
          label={{ value: "Time", position: "insideBottom", offset: -10 }}
        />

        <YAxis
          key={selectedSensor}
          yAxisId={selectedSensor}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={yAxisDomain}
          orientation="left"
          allowDataOverflow={false}
          scale="linear"
          padding={{ top: 20, bottom: 20 }}
          label={{
            value: `${sensorName} (${getSensorUnit(selectedSensor)})`,
            angle: -90,
            position: "insideLeft",
            style: { fill: getSensorColor(selectedSensor, false) },
          }}
        />

        <ChartTooltip content={<CustomTooltip />} />

        {/* Dynamic background zones based on actual deviation */}
        {chartData.map((item, index) => {
          const nextItem = chartData[index + 1];
          const x = item.timestamp;
          const width = nextItem
            ? nextItem.timestamp - item.timestamp
            : 3600000; // 1 hour default
          const y = yAxisDomain[0];
          const height = yAxisDomain[1] - yAxisDomain[0];

          return (
            <rect
              key={`zone-${index}`}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={item.zone_color}
              style={{ pointerEvents: "none" }}
            />
          );
        })}

        {/* Reference lines for thresholds around predicted values */}
        <Area
          type="monotone"
          dataKey="good_bound"
          stroke="rgba(0, 255, 0, 0.6)"
          strokeWidth={1}
          strokeDasharray="3 3"
          fill="rgba(0, 255, 0, 0.1)"
          yAxisId={selectedSensor}
          dot={false}
          activeDot={false}
          connectNulls
        />

        <Area
          type="monotone"
          dataKey="warning_bound"
          stroke="rgba(255, 238, 0, 0.7)"
          strokeWidth={1}
          strokeDasharray="5 2"
          fill="rgba(255, 238, 0, 0.1)"
          yAxisId={selectedSensor}
          dot={false}
          activeDot={false}
          connectNulls
        />

        {/* Data Lines */}
        <Line
          type="monotone"
          dataKey="predicted_value"
          stroke={getSensorColor(selectedSensor, true)}
          strokeWidth={2}
          yAxisId={selectedSensor}
          connectNulls
          dot={{ r: 3 }}
        />

        <Line
          type="linear"
          dataKey="real_value"
          stroke={getSensorColor(selectedSensor, false)}
          strokeWidth={2}
          yAxisId={selectedSensor}
          connectNulls
          dot={{ r: 3 }}
        />

        <Legend content={<CustomLegend />} />
      </ComposedChart>
    </ChartContainer>
  );
}

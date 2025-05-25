import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SENSOR_COLUMNS, getSensorColor } from "./config";
import { getStatusColor } from "./config";
import { useChartData } from "@/hooks/useChartData.";
import type { UseQueryResult } from "@tanstack/react-query";
import type { GetData } from "@/hooks/useData";

interface ChartDisplayProps {
  modelData: UseQueryResult<GetData>;
  selectedSensor: string;
}

export function ChartDisplay({ modelData, selectedSensor }: ChartDisplayProps) {
  const {
    processedData,
    getTimePeriods,
    getYAxisDomain,
    getChartConfig,
    getSensorUnit,
  } = useChartData(modelData, selectedSensor);

  return (
    <>
      {modelData.isSuccess ? (
        <ChartContainer
          key={modelData.data?.sensorName}
          config={getChartConfig}
          className="min-h-[400px]"
        >
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              top: 20,
              right:85,
              left: 20,
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
              domain={getYAxisDomain}
              orientation="left"
              allowDataOverflow={false}
              scale="linear"
              padding={{ top: 20, bottom: 20 }}
              label={{
                value: `${
                  SENSOR_COLUMNS.find((s) => s.id === selectedSensor)?.name
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
                  indicator="line"
                  labelKey={selectedSensor}
                />
              }
            />

            {getTimePeriods.map((period, index) => (
              <ReferenceArea
                key={`time-zone-${index}-${period.status}`}
                x1={
                  period.start instanceof Date
                    ? period.start.getTime()
                    : period.start
                }
                x2={
                  period.end instanceof Date ? period.end.getTime() : period.end
                }
                fill={getStatusColor(period.status)}
                fillOpacity={0.3}
                strokeOpacity={0}
                ifOverflow="visible"
                yAxisId={selectedSensor}
              />
            ))}

            <ReferenceLine
              y={modelData.data.thresholds.danger}
              stroke={getStatusColor("danger")}
              strokeWidth={2}
              strokeDasharray="5 5"
              yAxisId={selectedSensor}
              label={{
                position: "right",
                value: `Danger (${modelData.data.thresholds.danger})`,
                fill: getStatusColor("danger"),
                fontSize: 12,
                offset: 10,
              }}
              ifOverflow="extendDomain"
            />

            <ReferenceLine
              y={modelData.data.thresholds.warning}
              stroke={getStatusColor("warning")}
              strokeWidth={2}
              strokeDasharray="5 5"
              yAxisId={selectedSensor}
              label={{
                position: "right",
                value: `Warning (${modelData.data.thresholds.warning})`,
                fill: getStatusColor("warning"),
                fontSize: 12,
                offset: 10,
              }}
              ifOverflow="extendDomain"
            />

            <ReferenceLine
              y={modelData.data.thresholds.good}
              stroke={getStatusColor("good")}
              strokeWidth={2}
              strokeDasharray="5 5"
              yAxisId={selectedSensor}
              label={{
                position: "right",
                value: `Good (${modelData.data.thresholds.good})`,
                fill: getStatusColor("good"),
                fontSize: 12,
                offset: 10,
              }}
              ifOverflow="extendDomain"
            />

            <Line
              type="monotone"
              dataKey="predicted_value"
              stroke={getSensorColor(selectedSensor, true)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />

            <Line
              type="linear"
              dataKey="real_value"
              stroke={getSensorColor(selectedSensor, false)}
              strokeWidth={2}
              yAxisId={selectedSensor}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            {modelData.isPending
              ? "Loading..."
              : modelData.isError
              ? "Error loading data"
              : "No data available"}
          </p>
        </div>
      )}
    </>
  );
}

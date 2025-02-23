import { ChartConfig } from "@/components/ui/chart";
import { LineGraph } from "./LinearChart";

const chartData = [
  { month: "January", real: 0.186, predicted: 0.2 },
  { month: "February", real: 0.305, predicted: 0.3 },
  { month: "March", real: 0.237, predicted: 0.25 },
  { month: "April", real: 0.73, predicted: 0.1 },
  { month: "May", real: 0.209, predicted: 0.2 },
  { month: "June", real: 0.214, predicted: 0.22 },
];
const chartData2 = [
  { month: "January", real: 0.12, predicted: 0.15 },
  { month: "February", real: 0.67, predicted: 0.65 },
  { month: "March", real: 0.5, predicted: 0.55 },
  { month: "April", real: 0.4, predicted: 0.45 },
  { month: "May", real: 0.3, predicted: 0.35 },
  { month: "June", real: 0.2, predicted: 0.25 },
];

const chartConfig = {
  real: {
    label: "Real",
    color: "hsl(var(--chart-1))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Home() {
  return (
    <div className="container space-y-5 my-10 min-h-screen">
      <LineGraph
        chartConfig={chartConfig}
        chartData={chartData}
        header="Metal Output Intensity"
      />
      <LineGraph
        chartConfig={chartConfig}
        chartData={chartData2}
        header="Active Power"
      />
    </div>
  );
}

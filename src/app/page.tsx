import { DynamicLineChart } from "@/components/dynamic-chart/dynamic-chart";

export default function Home() {
  return (
    <div className="container space-y-5 my-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sensor Data Visualization</h1>
      <div className="border rounded-lg p-4 bg-card">
        <DynamicLineChart />
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERCENTAGE_THRESHOLDS } from "@/config/sensors";

export function ZoneLegend() {
  const { goodDeviationPercent, warningDeviationPercent } =
    PERCENTAGE_THRESHOLDS;

  const zones = [
    {
      color: "rgba(0, 255, 0, 0.2)",
      label: "Good Zone",
      description: `When actual values are within ${goodDeviationPercent}% of predicted values`,
    },
    {
      color: "rgba(255, 238, 0, 0.2)",
      label: "Warning Zone",
      description: `When actual values deviate ${goodDeviationPercent}% - ${warningDeviationPercent}% from predicted`,
    },
    {
      color: "rgba(255, 0, 0, 0.2)",
      label: "Critical Zone",
      description: `When actual values deviate more than ${warningDeviationPercent}% from predicted`,
    },
  ];

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Zone Information</CardTitle>
        <p className="text-xs text-muted-foreground">
          Background color shows how close actual values are to predicted values
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.label} className="flex items-start space-x-3">
            <div
              className="w-4 h-4 rounded-sm border border-border/20 mt-0.5 flex-shrink-0"
              style={{ backgroundColor: zone.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{zone.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {zone.description}
              </p>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-border/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Dashed lines</span> show threshold
            boundaries around predicted values for reference
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

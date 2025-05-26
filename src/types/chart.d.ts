export interface ChartDataPoint {
  timestamp: number;
  predicted_value: number;
  real_value: number;
  good_bound: number[];
  warning_bound: number[];
  deviation_percent: number;
  chart_y: number[];
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface ChartZone {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  fill: string;
}

export interface TooltipPayloadItem {
  dataKey: string
  value: number
  color: string
  name?: string
  payload?: ChartDataPoint
}

export interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}

export interface LegendPayloadItem {
  dataKey: string
  value: string
  type: string
  color: string
  payload?: {
    strokeDasharray?: string
  }
}

export interface CustomLegendProps {
  payload?: LegendPayloadItem[]
}

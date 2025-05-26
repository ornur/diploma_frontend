export interface SensorColumn {
  readonly id: string
  readonly name: string
  readonly unit: string
}

export interface SensorThresholds {
  maxGoodDeviation: number
  maxWarningDeviation: number
}

export interface SensorDataPoint {
  timestamp: Date
  predicted_value: number
  real_value: number
  spectre_color: string
}

export interface SensorData {
  sensorName: string
  data: SensorDataPoint[]
  message: string
  thresholds: SensorThresholds
}

export interface DateRange {
  start: Date
  end: Date
}

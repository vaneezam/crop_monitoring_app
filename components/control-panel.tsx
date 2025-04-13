"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NDVIPanel } from "@/components/panels/ndvi-panel"
import { WeatherPanel } from "@/components/panels/weather-panel"
import { AnalyticsPanel } from "@/components/panels/analytics-panel"

interface ControlPanelProps {
  layer: string
  field: any | null
  onClose: () => void
}

export function ControlPanel({ layer, field, onClose }: ControlPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background border-t p-4 h-1/3 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{layer} Data</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {layer === "ndvi" && <NDVIPanel field={field} />}
      {layer === "weather" && <WeatherPanel field={field} />}
      {layer === "analytics" && <AnalyticsPanel field={field} />}
    </div>
  )
}

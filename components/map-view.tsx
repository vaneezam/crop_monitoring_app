"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { TopBar } from "@/components/top-bar"
import { ControlPanel } from "@/components/control-panel"
import { Button } from "@/components/ui/button"
import { RefreshCw, Layers, CloudRain, Activity } from "lucide-react"
import { toast } from "sonner"

export function MapView() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<any | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to refresh satellite data
  const refreshSatelliteData = async () => {
    if (!selectedField) {
      toast({
        title: "No field selected",
        description: "Please select a field to refresh satellite data.",
        variant: "destructive",
      })
      return
    }

    setIsRefreshing(true)
    try {
      // Call the API to refresh satellite data
      const response = await fetch(`/api/fields/${selectedField.id}/refresh-satellite`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to refresh satellite data")
      }

      toast({
        title: "Data refreshed",
        description: "Satellite data has been successfully refreshed.",
      })

      // If a layer is active, refresh it
      if (activeLayer) {
        setActiveLayer(null)
        setTimeout(() => setActiveLayer(activeLayer), 100)
      }
    } catch (error) {
      console.error("Error refreshing satellite data:", error)
      toast({
        title: "Error",
        description: "Failed to refresh satellite data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle field selection from sidebar
  useEffect(() => {
    // Listen for field selection events
    const handleFieldSelect = (event: CustomEvent) => {
      setSelectedField(event.detail.field)
    }

    window.addEventListener("field-selected" as any, handleFieldSelect)

    return () => {
      window.removeEventListener("field-selected" as any, handleFieldSelect)
    }
  }, [])

  useEffect(() => {
    // Listen for show-layer events
    const handleShowLayer = (event: CustomEvent) => {
      setSelectedField(event.detail.field)
      setActiveLayer(event.detail.layer)
    }

    window.addEventListener("show-layer" as any, handleShowLayer)

    return () => {
      window.removeEventListener("show-layer" as any, handleShowLayer)
    }
  }, [])

  const handleLayerToggle = (layer: string) => {
    setActiveLayer(activeLayer === layer ? null : layer)
  }

  return (
    <div className="relative flex-1 h-full overflow-hidden">
      <TopBar />

      <div className="absolute top-16 right-4 z-10 flex flex-col gap-2">
        <Button
          variant={activeLayer === "ndvi" ? "default" : "secondary"}
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleLayerToggle("ndvi")}
          disabled={!selectedField}
        >
          <Layers size={16} />
          <span>NDVI</span>
        </Button>

        <Button
          variant={activeLayer === "weather" ? "default" : "secondary"}
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleLayerToggle("weather")}
          disabled={!selectedField}
        >
          <CloudRain size={16} />
          <span>Weather</span>
        </Button>

        <Button
          variant={activeLayer === "analytics" ? "default" : "secondary"}
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleLayerToggle("analytics")}
          disabled={!selectedField}
        >
          <Activity size={16} />
          <span>Analytics</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={refreshSatelliteData}
          disabled={isRefreshing || !selectedField}
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </Button>
      </div>

      <div className="h-full w-full">
        <MapContainer
          center={[-15.4167, 28.2833]} // Zambia (example)
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Field polygons would be rendered here */}
          {selectedField && (
            <GeoJSON
              data={selectedField.geometry}
              style={{
                color: "#10b981",
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.2,
              }}
            />
          )}
        </MapContainer>
      </div>

      {activeLayer && <ControlPanel layer={activeLayer} field={selectedField} onClose={() => setActiveLayer(null)} />}
    </div>
  )
}

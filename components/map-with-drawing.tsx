"use client"

import { useState, useRef } from "react"
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

interface MapWithDrawingProps {
  onCoordinatesChange: (coordinates: string, area: number) => void
}

export default function MapWithDrawing({ onCoordinatesChange }: MapWithDrawingProps) {
  const [drawnItems, setDrawnItems] = useState<L.FeatureGroup | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  // Handle map drawing events
  const handleCreated = (e: any) => {
    const layer = e.layer

    // Clear previous layers
    if (drawnItems) {
      drawnItems.clearLayers()
      drawnItems.addLayer(layer)
    }

    // Get the coordinates from the drawn shape
    if (layer instanceof L.Polygon) {
      const coordinates = layer.getLatLngs()[0].map((latLng: L.LatLng) => [latLng.lng, latLng.lat])

      // Close the polygon by adding the first point at the end
      coordinates.push(coordinates[0])

      // Create GeoJSON object
      const geoJSON = {
        type: "Polygon",
        coordinates: [coordinates],
      }

      // Update the form field
      onCoordinatesChange(JSON.stringify(geoJSON), calculateAreaInHectares(layer))
    }
  }

  // Calculate area in hectares
  const calculateAreaInHectares = (layer: L.Polygon): number => {
    // @ts-ignore - L.GeometryUtil is added by the leaflet-geometryutil package
    const areaInSquareMeters = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
    return areaInSquareMeters / 10000 // Convert to hectares
  }

  return (
    <MapContainer
      center={[-15.4167, 28.2833]} // Zambia (example)
      zoom={6}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => {
        mapRef.current = map
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <FeatureGroup
        ref={(featureGroupRef) => {
          if (featureGroupRef) {
            setDrawnItems(featureGroupRef)
          }
        }}
      >
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              drawError: {
                color: "#e1e0e0",
                message: "<strong>Error:</strong> Shape edges cannot cross!",
              },
              shapeOptions: {
                color: "#10b981",
              },
            },
          }}
          edit={{
            featureGroup: drawnItems as L.FeatureGroup,
            remove: true,
            edit: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

interface NDVIPanelProps {
  field: any | null
}

// Function to determine health status based on NDVI value
const getHealthStatus = (ndvi: number) => {
  if (ndvi >= 0.7) {
    return { status: "Excellent", color: "text-green-500" }
  } else if (ndvi >= 0.5) {
    return { status: "Good", color: "text-green-400" }
  } else if (ndvi >= 0.3) {
    return { status: "Moderate", color: "text-yellow-500" }
  } else {
    return { status: "Poor", color: "text-red-500" }
  }
}

export function NDVIPanel({ field }: NDVIPanelProps) {
  const [timeRange, setTimeRange] = useState("3months")
  const [loading, setLoading] = useState(false)
  const [ndviData, setNdviData] = useState([
    { date: "Jan 1", value: 0.65 },
    { date: "Jan 15", value: 0.68 },
    { date: "Feb 1", value: 0.72 },
    { date: "Feb 15", value: 0.75 },
    { date: "Mar 1", value: 0.78 },
    { date: "Mar 15", value: 0.76 },
    { date: "Apr 1", value: 0.73 },
  ])
  const [satelliteImages, setSatelliteImages] = useState<{
    ndvi?: string
    ndmi?: string
    ndwi?: string
    evi?: string
  }>({})

  // Fetch satellite data when field or time range changes
  useEffect(() => {
    if (!field) return

    const fetchSatelliteData = async () => {
      setLoading(true)
      try {
        // Calculate dates based on time range
        const toDate = new Date().toISOString().split("T")[0]
        let fromDate

        switch (timeRange) {
          case "1month":
            fromDate = getDateXDaysAgo(30)
            break
          case "3months":
            fromDate = getDateXDaysAgo(90)
            break
          case "6months":
            fromDate = getDateXDaysAgo(180)
            break
          case "1year":
            fromDate = getDateXDaysAgo(365)
            break
          default:
            fromDate = getDateXDaysAgo(90)
        }

        // Fetch satellite data from API
        const response = await fetch(`/api/fields/${field.id}/satellite-data?fromDate=${fromDate}&toDate=${toDate}`)

        if (!response.ok) {
          throw new Error("Failed to fetch satellite data")
        }

        const data = await response.json()

        // Process and set the data
        // In a real app, you would process the response to extract the images and NDVI values
        // For this example, we'll just set some placeholder data

        // Set satellite images
        setSatelliteImages({
          ndvi: data.ndvi?.default || "/placeholder-ndvi.png",
          ndmi: data.ndmi?.default || "/placeholder-ndmi.png",
          ndwi: data.ndwi?.default || "/placeholder-ndwi.png",
          evi: data.evi?.default || "/placeholder-evi.png",
        })

        // Generate some sample NDVI data points
        // In a real app, you would extract this from the API response
        const newNdviData = generateSampleNdviData(fromDate, toDate)
        setNdviData(newNdviData)
      } catch (error) {
        console.error("Error fetching satellite data:", error)
        // Keep the sample data in case of error
      } finally {
        setLoading(false)
      }
    }

    fetchSatelliteData()
  }, [field, timeRange])

  // Helper function to generate sample NDVI data
  const generateSampleNdviData = (fromDate: string, toDate: string) => {
    const start = new Date(fromDate)
    const end = new Date(toDate)
    const data = []

    // Generate a data point every 15 days
    const current = new Date(start)
    while (current <= end) {
      // Generate a random NDVI value between 0.5 and 0.8
      const value = 0.5 + Math.random() * 0.3

      data.push({
        date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Number.parseFloat(value.toFixed(2)),
      })

      // Add 15 days
      current.setDate(current.getDate() + 15)
    }

    return data
  }

  // Helper function to get date X days ago
  const getDateXDaysAgo = (days: number): string => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split("T")[0]
  }

  const currentNDVI = ndviData[ndviData.length - 1]?.value || 0
  const healthStatus = getHealthStatus(currentNDVI)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">NDVI Analysis</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading satellite data...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current NDVI</CardTitle>
                <CardDescription>Latest measurement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentNDVI.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Health Status</CardTitle>
                <CardDescription>Based on NDVI values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${healthStatus.color}`}>{healthStatus.status}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average NDVI</CardTitle>
                <CardDescription>Over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(ndviData.reduce((sum, item) => sum + item.value, 0) / ndviData.length).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>NDVI Trend</CardTitle>
              <CardDescription>Normalized Difference Vegetation Index over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ndviData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#10b981" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="ndvi">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="ndvi">NDVI</TabsTrigger>
              <TabsTrigger value="ndmi">NDMI</TabsTrigger>
              <TabsTrigger value="ndwi">NDWI</TabsTrigger>
              <TabsTrigger value="chlorophyll">Chlorophyll</TabsTrigger>
              <TabsTrigger value="msavi">MSAVI</TabsTrigger>
            </TabsList>
            <TabsContent value="ndvi" className="pt-4">
              {satelliteImages.ndvi && (
                <div className="mb-4">
                  <img
                    src={satelliteImages.ndvi || "/placeholder.svg"}
                    alt="NDVI Visualization"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              <p>
                The Normalized Difference Vegetation Index (NDVI) is a simple graphical indicator that can be used to
                analyze remote sensing measurements and assess whether the target being observed contains live green
                vegetation or not.
              </p>
            </TabsContent>
            <TabsContent value="ndmi" className="pt-4">
              {satelliteImages.ndmi && (
                <div className="mb-4">
                  <img
                    src={satelliteImages.ndmi || "/placeholder.svg"}
                    alt="NDMI Visualization"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              <p>
                The Normalized Difference Moisture Index (NDMI) is used to determine vegetation water content. NDMI is
                calculated as a ratio between the NIR and SWIR values in traditional fashion.
              </p>
            </TabsContent>
            <TabsContent value="ndwi" className="pt-4">
              {satelliteImages.ndwi && (
                <div className="mb-4">
                  <img
                    src={satelliteImages.ndwi || "/placeholder.svg"}
                    alt="NDWI Visualization"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              <p>
                The Normalized Difference Water Index (NDWI) is used to monitor changes in water content of leaves,
                using near-infrared (NIR) and short-wave infrared (SWIR) wavelengths.
              </p>
            </TabsContent>
            <TabsContent value="chlorophyll" className="pt-4">
              {satelliteImages.evi && (
                <div className="mb-4">
                  <img
                    src={satelliteImages.evi || "/placeholder.svg"}
                    alt="EVI Visualization"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              <p>
                Chlorophyll content in leaves is an indicator of plant health and photosynthetic capacity. Higher values
                indicate healthier vegetation.
              </p>
            </TabsContent>
            <TabsContent value="msavi" className="pt-4">
              <p>
                The Modified Soil Adjusted Vegetation Index (MSAVI) is designed to minimize soil background influences
                in the spectral data.
              </p>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

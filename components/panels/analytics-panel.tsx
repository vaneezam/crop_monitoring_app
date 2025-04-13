"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface AnalyticsPanelProps {
  field: any | null
}

export function AnalyticsPanel({ field }: AnalyticsPanelProps) {
  // Example analytics data
  const cropHealthData = [
    { month: "Jan", ndvi: 0.65, ndmi: 0.45, ndwi: 0.35 },
    { month: "Feb", ndvi: 0.68, ndmi: 0.48, ndwi: 0.38 },
    { month: "Mar", ndvi: 0.72, ndmi: 0.52, ndwi: 0.42 },
    { month: "Apr", ndvi: 0.75, ndmi: 0.55, ndwi: 0.45 },
    { month: "May", ndvi: 0.78, ndmi: 0.58, ndwi: 0.48 },
    { month: "Jun", ndvi: 0.76, ndmi: 0.56, ndwi: 0.46 },
  ]

  const seasonalComparisonData = [
    { month: "Jan", current: 0.65, previous: 0.6 },
    { month: "Feb", current: 0.68, previous: 0.62 },
    { month: "Mar", current: 0.72, previous: 0.65 },
    { month: "Apr", current: 0.75, previous: 0.68 },
    { month: "May", current: 0.78, previous: 0.7 },
    { month: "Jun", current: 0.76, previous: 0.72 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Crop Health Summary</CardTitle>
            <CardDescription>Overall assessment based on satellite data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Good Health</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your crop is showing good health indicators with NDVI values consistently above 0.6.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">NDVI</div>
                  <div className="text-2xl font-bold text-green-600">0.76</div>
                  <div className="flex items-center justify-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">NDMI</div>
                  <div className="text-2xl font-bold text-blue-600">0.56</div>
                  <div className="flex items-center justify-center text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">EVI</div>
                  <div className="text-2xl font-bold text-yellow-600">0.62</div>
                  <div className="flex items-center justify-center text-xs text-yellow-600">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -1%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Recommendations</CardTitle>
            <CardDescription>Action items based on current data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Moisture Alert</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Northern section shows slightly lower moisture levels. Consider targeted irrigation.
                </AlertDescription>
              </Alert>

              <div className="text-sm space-y-2">
                <h4 className="font-medium">Recommendations:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Schedule irrigation for the northern section within the next 3 days</li>
                  <li>• Optimal time for fertilizer application based on current growth stage</li>
                  <li>• Monitor for early signs of pest activity in the eastern section</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="comparison">Seasonal Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Crop Health Indicators</CardTitle>
              <CardDescription>Tracking multiple health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cropHealthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ndvi"
                      name="NDVI"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="ndmi" name="NDMI" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="ndwi" name="NDWI" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current vs. Previous Season</CardTitle>
              <CardDescription>Comparing crop performance with last season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={seasonalComparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" name="Current Season" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="previous" name="Previous Season" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

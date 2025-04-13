"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react"

interface WeatherPanelProps {
  field: any | null
}

export function WeatherPanel({ field }: WeatherPanelProps) {
  // Example weather forecast data
  const forecast = [
    {
      day: "Today",
      date: "Apr 13",
      temp: 28,
      condition: "Sunny",
      precipitation: 0,
      humidity: 45,
      windSpeed: 12,
      icon: Sun,
    },
    {
      day: "Tomorrow",
      date: "Apr 14",
      temp: 26,
      condition: "Partly Cloudy",
      precipitation: 10,
      humidity: 50,
      windSpeed: 10,
      icon: Sun,
    },
    {
      day: "Wednesday",
      date: "Apr 15",
      temp: 25,
      condition: "Cloudy",
      precipitation: 20,
      humidity: 60,
      windSpeed: 8,
      icon: CloudRain,
    },
    {
      day: "Thursday",
      date: "Apr 16",
      temp: 24,
      condition: "Rain",
      precipitation: 80,
      humidity: 75,
      windSpeed: 15,
      icon: CloudRain,
    },
    {
      day: "Friday",
      date: "Apr 17",
      temp: 23,
      condition: "Showers",
      precipitation: 60,
      humidity: 70,
      windSpeed: 12,
      icon: CloudRain,
    },
    {
      day: "Saturday",
      date: "Apr 18",
      temp: 25,
      condition: "Partly Cloudy",
      precipitation: 30,
      humidity: 65,
      windSpeed: 10,
      icon: Sun,
    },
    {
      day: "Sunday",
      date: "Apr 19",
      temp: 27,
      condition: "Sunny",
      precipitation: 0,
      humidity: 55,
      windSpeed: 8,
      icon: Sun,
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">7-Day Weather Forecast</h3>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {forecast.map((day) => (
          <Card key={day.date} className="overflow-hidden">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm">{day.day}</CardTitle>
              <CardDescription>{day.date}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex flex-col items-center justify-center py-2">
                <day.icon className="h-8 w-8 mb-1" />
                <div className="text-xl font-bold">{day.temp}°C</div>
                <div className="text-xs text-muted-foreground">{day.condition}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                  <div className="flex items-center">
                    <CloudRain className="h-3 w-3 mr-1" />
                    <span>{day.precipitation}%</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <Wind className="h-3 w-3 mr-1" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weather Impact on Crop</CardTitle>
          <CardDescription>How current weather conditions may affect your crop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Thermometer className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Temperature</h4>
                  <p className="text-sm text-muted-foreground">
                    Current temperatures are optimal for crop growth. No stress conditions detected.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CloudRain className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Precipitation</h4>
                  <p className="text-sm text-muted-foreground">
                    Expected rainfall in the next 3 days will provide adequate moisture for current growth stage.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Wind className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Wind</h4>
                  <p className="text-sm text-muted-foreground">
                    Wind speeds are within normal range. No risk of physical damage to crops.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-medium mb-1">Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Consider irrigation on Saturday and Sunday due to low precipitation forecast</li>
                <li>• Monitor for pest activity as temperatures rise toward the weekend</li>
                <li>• Ideal conditions for fertilizer application on Wednesday before rain</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

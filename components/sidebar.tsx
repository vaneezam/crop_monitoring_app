"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Plus, Home, Map, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddFieldForm } from "@/components/add-field-form"

// Update the Sidebar component to handle field selection
export function Sidebar() {
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const handleAddFieldSubmit = (data: any) => {
    console.log("Field added:", data)
    // Handle the form submission logic here
  }

  const handleAddFieldCancel = () => {
    console.log("Field add cancelled")
    // Handle the cancel logic here
  }
  // Example fields data with geometry
  const fields = [
    {
      id: "field1",
      name: "Maize Field - North",
      crop: "Maize",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [28.2833, -15.4167],
            [28.2933, -15.4167],
            [28.2933, -15.4267],
            [28.2833, -15.4267],
            [28.2833, -15.4167],
          ],
        ],
      },
    },
    {
      id: "field2",
      name: "Soybean Field - East",
      crop: "Soybean",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [28.3833, -15.4167],
            [28.3933, -15.4167],
            [28.3933, -15.4267],
            [28.3833, -15.4267],
            [28.3833, -15.4167],
          ],
        ],
      },
    },
    {
      id: "field3",
      name: "Cotton Field - South",
      crop: "Cotton",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [28.2833, -15.5167],
            [28.2933, -15.5167],
            [28.2933, -15.5267],
            [28.2833, -15.5267],
            [28.2833, -15.5167],
          ],
        ],
      },
    },
  ]

  const toggleField = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const selectField = (fieldId: string) => {
    setSelectedFieldId(fieldId)
    const field = fields.find((f) => f.id === fieldId)

    if (field) {
      // Dispatch a custom event to notify the map component
      const event = new CustomEvent("field-selected", {
        detail: { field },
      })
      window.dispatchEvent(event as any)
    }
  }

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            <AddFieldForm onSubmit={handleAddFieldSubmit} onCancel={handleAddFieldCancel}/>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Map className="mr-2 h-4 w-4" />
              All Fields
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">My Fields</h3>
            <div className="space-y-1">
              {fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <Button
                    variant={selectedFieldId === field.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      toggleField(field.id)
                      selectField(field.id)
                    }}
                  >
                    {expandedFields[field.id] ? (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    {field.name}
                  </Button>

                  {expandedFields[field.id] && (
                    <div className="pl-6 space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => selectField(field.id)}
                      >
                        View on Map
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          selectField(field.id)
                          // Dispatch a custom event to show NDVI data
                          const event = new CustomEvent("show-layer", {
                            detail: { layer: "ndvi", field },
                          })
                          window.dispatchEvent(event as any)
                        }}
                      >
                        NDVI Data
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          selectField(field.id)
                          // Dispatch a custom event to show weather data
                          const event = new CustomEvent("show-layer", {
                            detail: { layer: "weather", field },
                          })
                          window.dispatchEvent(event as any)
                        }}
                      >
                        Weather
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          selectField(field.id)
                          // Dispatch a custom event to show analytics
                          const event = new CustomEvent("show-layer", {
                            detail: { layer: "analytics", field },
                          })
                          window.dispatchEvent(event as any)
                        }}
                      >
                        Analytics
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

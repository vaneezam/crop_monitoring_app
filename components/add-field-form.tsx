"use client"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { initializeLeafletIcons } from "@/lib/leaflet-config"

// Dynamically import the map components to avoid SSR issues
const MapWithDrawing = dynamic(() => import("@/components/map-with-drawing"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-muted">Loading map...</div>,
})

const formSchema = z.object({
  farmerName: z.string().min(2, { message: "Farmer name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  cropName: z.string().min(1, { message: "Crop name is required" }),
  coordinates: z.string().min(1, { message: "Coordinates are required" }),
  plantingDate: z.string().min(1, { message: "Planting date is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  district: z.string().min(1, { message: "District is required" }),
  town: z.string().min(1, { message: "Town is required" }),
  chief: z.string().min(1, { message: "Chief of the land is required" }),
  farmSize: z.string().min(1, { message: "Farm size is required" }),
  landUsage: z.string().min(1, { message: "Land usage is required" }),
  farmingMethod: z.string().min(1, { message: "Farming method is required" }),
  tillageType: z.string().min(1, { message: "Tillage type is required" }),
  fertilizers: z.string().min(1, { message: "Fertilizers information is required" }),
  irrigationType: z.string().min(1, { message: "Irrigation type is required" }),
  previousCrops: z.string().min(1, { message: "Previous crops information is required" }),
})

interface AddFieldFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function AddFieldForm({ onSubmit, onCancel }: AddFieldFormProps) {
  // Initialize Leaflet icons
  useEffect(() => {
    initializeLeafletIcons()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerName: "",
      email: "",
      phone: "",
      cropName: "",
      coordinates: "",
      plantingDate: "",
      country: "",
      province: "",
      district: "",
      town: "",
      chief: "",
      farmSize: "",
      landUsage: "Agriculture",
      farmingMethod: "",
      tillageType: "",
      fertilizers: "",
      irrigationType: "Rainfed",
      previousCrops: "",
    },
  })

  // Handle coordinates update from the map
  const handleCoordinatesChange = (coordinates: string, area: number) => {
    form.setValue("coordinates", coordinates)
    form.setValue("farmSize", area.toFixed(2))
  }

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="map">Draw Field</TabsTrigger>
            <TabsTrigger value="farming">Farming Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="farmerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farmer's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Maize" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plantingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planting Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Zambia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Central" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="Kabwe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town</FormLabel>
                    <FormControl>
                      <Input placeholder="Kabwe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief of the Land</FormLabel>
                  <FormControl>
                    <Input placeholder="Chief name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="farmSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Size (hectares)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Usage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select land usage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Conservation">Conservation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="map" className="space-y-4 pt-4">
            <FormItem>
              <FormLabel>Draw Your Field on the Map</FormLabel>
              <FormDescription>
                Use the drawing tools to outline your field. Click the polygon icon and then click on the map to create
                points. Double-click to complete the shape.
              </FormDescription>
              <div className="h-[400px] w-full border rounded-md overflow-hidden">
                <MapWithDrawing onCoordinatesChange={handleCoordinatesChange} />
              </div>
              <FormField
                control={form.control}
                name="coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Coordinates (GeoJSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Coordinates will appear here after drawing on the map"
                        {...field}
                        readOnly
                        className="font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>
          </TabsContent>

          <TabsContent value="farming" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="farmingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farming Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Conventional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tillageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tillage Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tillage type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Conventional">Conventional</SelectItem>
                      <SelectItem value="Reduced">Reduced</SelectItem>
                      <SelectItem value="Conservation">Conservation</SelectItem>
                      <SelectItem value="No-till">No-till</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fertilizers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fertilizers Used (Past 3 Seasons)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List fertilizers used in the past 3 seasons" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="irrigationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Irrigation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select irrigation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Overhead">Overhead</SelectItem>
                      <SelectItem value="Drip">Drip</SelectItem>
                      <SelectItem value="Rainfed">Rainfed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousCrops"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Crops (Past 3 Seasons)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List crops grown in the past 3 seasons with planting dates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Field</Button>
        </div>
      </form>
    </Form>
  )
}

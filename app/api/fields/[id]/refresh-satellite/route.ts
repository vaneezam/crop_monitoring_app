import { NextResponse } from "next/server"
import { getAllIndices } from "@/lib/sentinel-hub"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const fieldId = params.id

    // In a real app, you would fetch the field data from your database
    // For this example, we'll use a hardcoded polygon
    const fieldGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [28.2833, -15.4167], // Example coordinates for Zambia
          [28.2933, -15.4167],
          [28.2933, -15.4267],
          [28.2833, -15.4267],
          [28.2833, -15.4167],
        ],
      ],
    }

    // Get current date and date 30 days ago
    const toDate = new Date().toISOString().split("T")[0]
    const fromDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]

    // Fetch fresh satellite data
    await getAllIndices(fieldGeometry, fromDate, toDate)

    // In a real app, you would store this data in your database

    return NextResponse.json({ success: true, message: "Satellite data refreshed successfully" })
  } catch (error) {
    console.error("Error refreshing satellite data:", error)
    return NextResponse.json({ error: "Failed to refresh satellite data" }, { status: 500 })
  }
}

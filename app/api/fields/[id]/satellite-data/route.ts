import { NextResponse } from "next/server"
import { getAllIndices } from "@/lib/sentinel-hub"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get("fromDate") || getDateXDaysAgo(30)
    const toDate = searchParams.get("toDate") || getCurrentDate()

    // In a real app, you would fetch the field geometry from your database
    // For this example, we'll use a hardcoded polygon
    // This represents a small agricultural field
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

    const indices = await getAllIndices(fieldGeometry, fromDate, toDate)

    return NextResponse.json(indices)
  } catch (error) {
    console.error("Error fetching satellite data:", error)
    return NextResponse.json({ error: "Failed to fetch satellite data" }, { status: 500 })
  }
}

// Helper functions
function getCurrentDate(): string {
  const date = new Date()
  return date.toISOString().split("T")[0]
}

function getDateXDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

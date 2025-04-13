// Sentinel Hub API service

// Constants for API endpoints
const SENTINEL_HUB_AUTH_URL = "https://services.sentinel-hub.com/oauth/token"
const SENTINEL_HUB_PROCESS_API = "https://services.sentinel-hub.com/api/v1/process"

// Interface for field coordinates
interface FieldCoordinates {
  type: string
  coordinates: number[][][]
}

// Interface for authentication response
interface AuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

// Cache for the access token
let accessToken: string | null = null
let tokenExpiry: number | null = null

/**
 * Get an access token for Sentinel Hub API
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  const clientId = process.env.SENTINEL_HUB_CLIENT_ID
  const clientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Sentinel Hub credentials not configured")
  }

  try {
    const response = await fetch(SENTINEL_HUB_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`)
    }

    const data = (await response.json()) as AuthResponse

    // Store the token and set expiry (subtract 5 minutes for safety)
    accessToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000 - 300000

    return accessToken
  } catch (error) {
    console.error("Error getting Sentinel Hub access token:", error)
    throw new Error("Failed to authenticate with Sentinel Hub")
  }
}

/**
 * Get NDVI data for a specific field
 */
export async function getNDVIData(fieldGeometry: FieldCoordinates, fromDate: string, toDate: string): Promise<any> {
  try {
    const token = await getAccessToken()

    // Prepare the request payload for Sentinel-2 L2A data
    const payload = {
      input: {
        bounds: {
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
          bbox: getBoundingBox(fieldGeometry.coordinates[0]),
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: fromDate + "T00:00:00Z",
                to: toDate + "T23:59:59Z",
              },
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/png",
            },
          },
          {
            identifier: "ndvi",
            format: {
              type: "image/png",
            },
          },
          {
            identifier: "dataMask",
            format: {
              type: "image/png",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: [
              { id: "default", bands: 3 },
              { id: "ndvi", bands: 1 },
              { id: "dataMask", bands: 1 }
            ]
          };
        }

        function evaluatePixel(sample) {
          let ndvi = index(sample.B08, sample.B04);
          
          // NDVI visualization
          let ndviVis = colorBlend(ndvi,
            [-0.2, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
            [
              [0.05, 0.05, 0.05],
              [0.75, 0.75, 0.75],
              [0.86, 0.86, 0.86],
              [1, 1, 0.88],
              [1, 0.98, 0.8],
              [0.93, 0.91, 0.71],
              [0.73, 0.85, 0.59],
              [0.53, 0.78, 0.47],
              [0.33, 0.70, 0.36],
              [0.13, 0.63, 0.25],
              [0.05, 0.56, 0.15]
            ]
          );
          
          // True color visualization
          let trueColor = [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
          
          return {
            default: trueColor,
            ndvi: [ndvi],
            dataMask: [sample.dataMask]
          };
        }

        function index(band1, band2) {
          return (band1 - band2) / (band1 + band2);
        }
      `,
    }

    const response = await fetch(SENTINEL_HUB_PROCESS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch NDVI data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching NDVI data:", error)
    throw new Error("Failed to fetch NDVI data from Sentinel Hub")
  }
}

/**
 * Get NDMI (Normalized Difference Moisture Index) data for a specific field
 */
export async function getNDMIData(fieldGeometry: FieldCoordinates, fromDate: string, toDate: string): Promise<any> {
  try {
    const token = await getAccessToken()

    const payload = {
      input: {
        bounds: {
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
          bbox: getBoundingBox(fieldGeometry.coordinates[0]),
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: fromDate + "T00:00:00Z",
                to: toDate + "T23:59:59Z",
              },
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/png",
            },
          },
          {
            identifier: "ndmi",
            format: {
              type: "image/png",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B08", "B11", "dataMask"],
            output: [
              { id: "default", bands: 3 },
              { id: "ndmi", bands: 1 }
            ]
          };
        }

        function evaluatePixel(sample) {
          let ndmi = index(sample.B08, sample.B11);
          
          // NDMI visualization
          let ndmiVis = colorBlend(ndmi,
            [-0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
            [
              [0.05, 0.05, 0.05],
              [0.75, 0.75, 0.75],
              [0.86, 0.86, 0.86],
              [0.88, 0.88, 1],
              [0.8, 0.82, 1],
              [0.6, 0.75, 0.98],
              [0.4, 0.7, 0.94],
              [0.2, 0.6, 0.9],
              [0, 0.5, 0.8]
            ]
          );
          
          return {
            default: ndmiVis,
            ndmi: [ndmi]
          };
        }

        function index(band1, band2) {
          return (band1 - band2) / (band1 + band2);
        }
      `,
    }

    const response = await fetch(SENTINEL_HUB_PROCESS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch NDMI data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching NDMI data:", error)
    throw new Error("Failed to fetch NDMI data from Sentinel Hub")
  }
}

/**
 * Get NDWI (Normalized Difference Water Index) data for a specific field
 */
export async function getNDWIData(fieldGeometry: FieldCoordinates, fromDate: string, toDate: string): Promise<any> {
  try {
    const token = await getAccessToken()

    const payload = {
      input: {
        bounds: {
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
          bbox: getBoundingBox(fieldGeometry.coordinates[0]),
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: fromDate + "T00:00:00Z",
                to: toDate + "T23:59:59Z",
              },
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/png",
            },
          },
          {
            identifier: "ndwi",
            format: {
              type: "image/png",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B03", "B08", "dataMask"],
            output: [
              { id: "default", bands: 3 },
              { id: "ndwi", bands: 1 }
            ]
          };
        }

        function evaluatePixel(sample) {
          let ndwi = index(sample.B03, sample.B08);
          
          // NDWI visualization
          let ndwiVis = colorBlend(ndwi,
            [-0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5],
            [
              [0.05, 0.05, 0.05],
              [0.5, 0.5, 0.5],
              [0.7, 0.7, 0.7],
              [0.9, 0.9, 0.9],
              [0.6, 0.8, 1],
              [0.4, 0.7, 1],
              [0.2, 0.6, 1],
              [0, 0.5, 1]
            ]
          );
          
          return {
            default: ndwiVis,
            ndwi: [ndwi]
          };
        }

        function index(band1, band2) {
          return (band1 - band2) / (band1 + band2);
        }
      `,
    }

    const response = await fetch(SENTINEL_HUB_PROCESS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch NDWI data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching NDWI data:", error)
    throw new Error("Failed to fetch NDWI data from Sentinel Hub")
  }
}

/**
 * Get EVI (Enhanced Vegetation Index) data for a specific field
 */
export async function getEVIData(fieldGeometry: FieldCoordinates, fromDate: string, toDate: string): Promise<any> {
  try {
    const token = await getAccessToken()

    const payload = {
      input: {
        bounds: {
          properties: {
            crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
          },
          bbox: getBoundingBox(fieldGeometry.coordinates[0]),
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: fromDate + "T00:00:00Z",
                to: toDate + "T23:59:59Z",
              },
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: "default",
            format: {
              type: "image/png",
            },
          },
          {
            identifier: "evi",
            format: {
              type: "image/png",
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B02", "B04", "B08", "dataMask"],
            output: [
              { id: "default", bands: 3 },
              { id: "evi", bands: 1 }
            ]
          };
        }

        function evaluatePixel(sample) {
          // EVI = 2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))
          let evi = 2.5 * ((sample.B08 - sample.B04) / (sample.B08 + 6 * sample.B04 - 7.5 * sample.B02 + 1));
          
          // EVI visualization
          let eviVis = colorBlend(evi,
            [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
            [
              [0.05, 0.05, 0.05],
              [0.75, 0.75, 0.75],
              [0.86, 0.86, 0.86],
              [1, 1, 0.88],
              [0.93, 0.91, 0.71],
              [0.73, 0.85, 0.59],
              [0.53, 0.78, 0.47],
              [0.33, 0.70, 0.36],
              [0.13, 0.63, 0.25]
            ]
          );
          
          return {
            default: eviVis,
            evi: [evi]
          };
        }
      `,
    }

    const response = await fetch(SENTINEL_HUB_PROCESS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch EVI data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching EVI data:", error)
    throw new Error("Failed to fetch EVI data from Sentinel Hub")
  }
}

/**
 * Helper function to get bounding box from coordinates
 */
function getBoundingBox(coordinates: number[][]): number[] {
  let minLon = Number.POSITIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLon = Number.NEGATIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  for (const point of coordinates) {
    const [lon, lat] = point
    minLon = Math.min(minLon, lon)
    minLat = Math.min(minLat, lat)
    maxLon = Math.max(maxLon, lon)
    maxLat = Math.max(maxLat, lat)
  }

  return [minLon, minLat, maxLon, maxLat]
}

/**
 * Get all vegetation indices for a field
 */
export async function getAllIndices(
  fieldGeometry: FieldCoordinates,
  fromDate: string = getDateXDaysAgo(30),
  toDate: string = getCurrentDate(),
): Promise<{
  ndvi: any
  ndmi: any
  ndwi: any
  evi: any
}> {
  try {
    // Fetch all indices in parallel
    const [ndvi, ndmi, ndwi, evi] = await Promise.all([
      getNDVIData(fieldGeometry, fromDate, toDate),
      getNDMIData(fieldGeometry, fromDate, toDate),
      getNDWIData(fieldGeometry, fromDate, toDate),
      getEVIData(fieldGeometry, fromDate, toDate),
    ])

    return { ndvi, ndmi, ndwi, evi }
  } catch (error) {
    console.error("Error fetching all indices:", error)
    throw new Error("Failed to fetch vegetation indices")
  }
}

/**
 * Helper function to get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  const date = new Date()
  return date.toISOString().split("T")[0]
}

/**
 * Helper function to get date X days ago in YYYY-MM-DD format
 */
function getDateXDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

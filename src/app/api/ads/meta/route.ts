import { NextRequest, NextResponse } from "next/server"
import { MetaAdLibraryAPI } from "@/lib/scrapers/meta-api"
import { prisma } from "@/lib/database/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pages = searchParams.get("pages")?.split(",") || []
    const limit = parseInt(searchParams.get("limit") || "50")

    if (pages.length === 0) {
      return NextResponse.json(
        { error: "At least one page name or ID is required" },
        { status: 400 }
      )
    }

    const metaAPI = new MetaAdLibraryAPI()
    let allAds: any[] = []

    // Try each page - could be either name or ID
    for (const page of pages) {
      try {
        let ads
        // Check if it's a page ID (numeric) or page name
        if (/^\d+$/.test(page)) {
          // It's a page ID
          ads = await metaAPI.getAdsByPageId(page, limit)
        } else {
          // It's a page name
          ads = await metaAPI.getAdsByPageName(page, limit)
        }
        allAds = allAds.concat(ads)
      } catch (error) {
        console.error(`Failed to fetch ads for ${page}:`, error)
      }
    }

    const ads = allAds

    // Store ads in database
    for (const ad of ads) {
      try {
        // First, ensure the competitor exists
        await prisma.competitor.upsert({
          where: { name: ad.competitorId },
          update: {
            platforms: {
              set: ["meta"] // Update to include meta if not already present
            }
          },
          create: {
            name: ad.competitorId,
            domain: `${ad.competitorId.toLowerCase().replace(/\s+/g, "")}.com`, // Basic domain guess
            platforms: ["meta"]
          }
        })

        // Then store the ad
        await prisma.ad.upsert({
          where: { id: ad.id },
          update: {
            text: ad.text,
            isActive: ad.isActive,
            estimatedReach: ad.estimatedReach,
            metadata: ad.metadata as any
          },
          create: {
            id: ad.id,
            competitorId: ad.competitorId,
            platform: ad.platform,
            creativeUrl: ad.creativeUrl,
            text: ad.text,
            dateFound: ad.dateFound,
            estimatedReach: ad.estimatedReach,
            format: ad.format,
            isActive: ad.isActive,
            metadata: ad.metadata as any,
            competitor: {
              connect: { name: ad.competitorId }
            }
          }
        })
      } catch (dbError) {
        console.error(`Failed to store ad ${ad.id}:`, dbError)
        // Continue with other ads even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      adsFound: ads.length,
      ads: ads.slice(0, 20) // Return first 20 for preview
    })
  } catch (error) {
    console.error("Meta API endpoint error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch Meta ads",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageNames, limit = 50 } = body

    if (!pageNames || !Array.isArray(pageNames) || pageNames.length === 0) {
      return NextResponse.json(
        { error: "pageNames array is required" },
        { status: 400 }
      )
    }

    const metaAPI = new MetaAdLibraryAPI()
    const ads = await metaAPI.getCompetitorAds(pageNames, limit)

    // Store in database similar to GET endpoint
    let storedCount = 0
    for (const ad of ads) {
      try {
        await prisma.competitor.upsert({
          where: { name: ad.competitorId },
          update: {
            platforms: {
              set: ["meta"]
            }
          },
          create: {
            name: ad.competitorId,
            domain: `${ad.competitorId.toLowerCase().replace(/\s+/g, "")}.com`,
            platforms: ["meta"]
          }
        })

        await prisma.ad.upsert({
          where: { id: ad.id },
          update: {
            text: ad.text,
            isActive: ad.isActive,
            estimatedReach: ad.estimatedReach,
            metadata: ad.metadata as any
          },
          create: {
            id: ad.id,
            competitorId: ad.competitorId,
            platform: ad.platform,
            creativeUrl: ad.creativeUrl,
            text: ad.text,
            dateFound: ad.dateFound,
            estimatedReach: ad.estimatedReach,
            format: ad.format,
            isActive: ad.isActive,
            metadata: ad.metadata as any,
            competitor: {
              connect: { name: ad.competitorId }
            }
          }
        })
        storedCount++
      } catch (dbError) {
        console.error(`Failed to store ad ${ad.id}:`, dbError)
      }
    }

    return NextResponse.json({
      success: true,
      adsFound: ads.length,
      adsStored: storedCount,
      message: `Successfully fetched and stored ${storedCount} ads from Meta Ad Library`
    })
  } catch (error) {
    console.error("Meta API POST endpoint error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch and store Meta ads",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
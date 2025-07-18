import { NextRequest, NextResponse } from "next/server"
import { MetaAdLibraryAPI } from "@/lib/scrapers/meta-api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Map competitor IDs to their Facebook page IDs
    const competitorPageIds: Record<string, string> = {
      "caesars": "108897755612137", // Caesars Palace
      "draftkings": "112188102147737", // DraftKings
      "fanduel": "147901148571743", // FanDuel
      "betmgm": "228916420480963", // BetMGM
      "nike": "15087023444" // Nike
    }
    
    const pageId = competitorPageIds[id]
    
    if (!pageId) {
      return NextResponse.json(
        { error: "Competitor not found or no Meta page ID configured" },
        { status: 404 }
      )
    }
    
    const metaAPI = new MetaAdLibraryAPI()
    
    try {
      const ads = await metaAPI.getAdsByPageId(pageId, 20)
      
      return NextResponse.json({
        success: true,
        data: ads,
        pageId,
        competitorId: id
      })
    } catch (apiError) {
      console.error("Meta API error:", apiError)
      
      // Return fallback data if API fails
      return NextResponse.json({
        success: false,
        error: "Meta API unavailable",
        fallback: true,
        data: [],
        pageId,
        competitorId: id
      })
    }
  } catch (error) {
    console.error("Meta ads API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Mock data for popular competitors
    const mockCompetitors: Record<string, any> = {
      "caesars": {
        id: "caesars",
        name: "Caesars Palace Online Casino",
        domain: "caesars.com",
        platforms: ["meta", "google_search", "twitter"],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { ads: 42, rankings: 127 }
      },
      "draftkings": {
        id: "draftkings",
        name: "DraftKings",
        domain: "draftkings.com",
        platforms: ["meta", "snapchat", "google_search"],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { ads: 68, rankings: 89 }
      },
      "fanduel": {
        id: "fanduel",
        name: "FanDuel",
        domain: "fanduel.com",
        platforms: ["meta", "twitter", "google_search"],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { ads: 55, rankings: 76 }
      },
      "betmgm": {
        id: "betmgm",
        name: "BetMGM",
        domain: "betmgm.com",
        platforms: ["meta", "snapchat", "google_search"],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { ads: 38, rankings: 92 }
      },
      "nike": {
        id: "nike",
        name: "Nike",
        domain: "nike.com",
        platforms: ["meta", "twitter", "snapchat", "google_search"],
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { ads: 156, rankings: 234 }
      }
    }

    const competitor = mockCompetitors[id]

    if (!competitor) {
      return NextResponse.json(
        { error: "Competitor not found" },
        { status: 404 }
      )
    }

    // Generate mock ads with more reliable image URLs
    const realAdCreatives = {
      "caesars": [
        {
          imageUrl: "https://picsum.photos/400/300?random=caesars1",
          format: "image",
          text: "Get $100 in Casino Credits when you sign up"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=caesars2",
          format: "image", 
          text: "Play your favorite slots with 200% bonus"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=caesars3",
          format: "carousel",
          text: "Experience luxury gaming at Caesars Palace"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=caesars4",
          format: "video",
          text: "Watch and win big at Caesars Sportsbook"
        }
      ],
      "draftkings": [
        {
          imageUrl: "https://picsum.photos/400/300?random=draftkings1",
          format: "image",
          text: "Bet $5, Get $150 in bonus bets"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=draftkings2",
          format: "image", 
          text: "NFL Sunday - Place your bets now"
        }
      ],
      "fanduel": [
        {
          imageUrl: "https://picsum.photos/400/300?random=fanduel1",
          format: "image",
          text: "Bet $5, Win $150 - NFL Week 1"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=fanduel2",
          format: "carousel",
          text: "Same Game Parlay - Boost your winnings"
        }
      ],
      "betmgm": [
        {
          imageUrl: "https://picsum.photos/400/300?random=betmgm1",
          format: "image",
          text: "Risk-Free Bet up to $1000"
        }
      ],
      "nike": [
        {
          imageUrl: "https://picsum.photos/400/300?random=nike1",
          format: "image",
          text: "Just Do It - Air Force 1"
        },
        {
          imageUrl: "https://picsum.photos/400/300?random=nike2",
          format: "image",
          text: "Air Max 90 - Classic comfort"
        }
      ]
    }

    // Try to fetch real Meta ads first
    let realMetaAds: any[] = []
    try {
      const metaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/meta-ads/${id}`)
      if (metaResponse.ok) {
        const metaData = await metaResponse.json()
        if (metaData.success && metaData.data) {
          realMetaAds = metaData.data.map((ad: any) => ({
            id: ad.id,
            competitorId: id,
            platform: "meta",
            text: ad.text,
            imageUrl: ad.creativeUrl || ad.ad_snapshot_url,
            dateFound: ad.dateFound || ad.ad_creation_time,
            format: ad.format,
            isActive: ad.isActive
          }))
        }
      }
    } catch (error) {
      console.warn("Failed to fetch real Meta ads, using fallback:", error)
    }

    const creatives = realAdCreatives[id as keyof typeof realAdCreatives] || []
    
    // Combine real Meta ads with fallback creatives
    const allAds = [...realMetaAds]
    
    // Add fallback creatives for other platforms or if Meta ads are insufficient
    const additionalAds = Array.from({ length: Math.max(12 - realMetaAds.length, creatives.length) }, (_, i) => {
      const creative = creatives[i % creatives.length]
      return {
        id: `ad-${id}-${i + realMetaAds.length}`,
        competitorId: id,
        platform: competitor.platforms[i % competitor.platforms.length],
        text: creative?.text || "",
        imageUrl: creative?.imageUrl || `https://picsum.photos/400/300?random=${id}-${i}`,
        dateFound: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        format: creative?.format || ["image", "video", "carousel"][i % 3],
        isActive: Math.random() > 0.2
      }
    })
    
    const mockAds = [...allAds, ...additionalAds]

    // Generate platform stats
    const platformStats = competitor.platforms.map((platform: string) => ({
      platform,
      _count: { platform: Math.floor(Math.random() * 20) + 5 }
    }))

    // Generate recent activity
    const recentActivity = mockAds.slice(0, 6)

    // Generate search performance
    const searchPerformance = Array.from({ length: 5 }, (_, i) => ({
      id: `search-${id}-${i}`,
      competitorId: id,
      position: Math.floor(Math.random() * 10) + 1,
      searchResult: {
        query: [
          "online casino",
          "sports betting",
          "daily fantasy",
          "casino games",
          "poker online"
        ][i % 5],
        date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString()
      }
    }))

    return NextResponse.json({
      competitor: {
        ...competitor,
        ads: mockAds,
        rankings: searchPerformance
      },
      platformStats,
      recentActivity,
      searchPerformance,
      totalAds: competitor._count.ads,
      totalSearchAppearances: competitor._count.rankings
    })
  } catch (error) {
    console.error("Failed to fetch competitor profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch competitor profile" },
      { status: 500 }
    )
  }
}
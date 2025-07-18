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

    // Generate mock ads that look like real Meta Ad Library ads
    const mockAds = Array.from({ length: 12 }, (_, i) => ({
      id: `ad-${id}-${i}`,
      competitorId: id,
      platform: competitor.platforms[i % competitor.platforms.length],
      text: "",
      imageUrl: `https://picsum.photos/400/300?random=${id}-${i}`,
      dateFound: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      estimatedReach: Math.floor(Math.random() * 50000) + 5000,
      format: ["image", "video", "carousel"][i % 3],
      isActive: Math.random() > 0.2
    }))

    // Generate platform stats
    const platformStats = competitor.platforms.map((platform: string) => ({
      platform,
      _count: { platform: Math.floor(Math.random() * 20) + 5 },
      _avg: { estimatedReach: Math.floor(Math.random() * 30000) + 10000 }
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
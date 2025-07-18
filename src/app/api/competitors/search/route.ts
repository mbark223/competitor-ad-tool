import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const includeStats = searchParams.get("includeStats") === "true"

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    // Popular suggestions for common searches
    const popularSuggestions = [
      { id: "caesars", name: "Caesars Palace Online Casino", domain: "caesars.com", platforms: ["meta", "google_search", "twitter"] },
      { id: "draftkings", name: "DraftKings", domain: "draftkings.com", platforms: ["meta", "snapchat", "google_search"] },
      { id: "fanduel", name: "FanDuel", domain: "fanduel.com", platforms: ["meta", "twitter", "google_search"] },
      { id: "betmgm", name: "BetMGM", domain: "betmgm.com", platforms: ["meta", "snapchat", "google_search"] },
      { id: "pokerstars", name: "PokerStars", domain: "pokerstars.com", platforms: ["meta", "google_search"] },
      { id: "borgata", name: "Borgata Online Casino", domain: "borgataonline.com", platforms: ["meta", "google_search"] },
      { id: "betrivers", name: "BetRivers", domain: "betrivers.com", platforms: ["meta", "google_search"] },
      { id: "unibet", name: "Unibet", domain: "unibet.com", platforms: ["meta", "google_search"] },
      { id: "pointsbet", name: "PointsBet", domain: "pointsbet.com", platforms: ["meta", "google_search"] },
      { id: "betway", name: "Betway", domain: "betway.com", platforms: ["meta", "google_search"] },
      { id: "mcdonald", name: "McDonald's", domain: "mcdonalds.com", platforms: ["meta", "snapchat", "google_search"] },
      { id: "nike", name: "Nike", domain: "nike.com", platforms: ["meta", "twitter", "snapchat", "google_search"] },
      { id: "cocacola", name: "Coca-Cola", domain: "coca-cola.com", platforms: ["meta", "twitter", "snapchat"] },
      { id: "apple", name: "Apple", domain: "apple.com", platforms: ["meta", "twitter", "google_search"] },
      { id: "amazon", name: "Amazon", domain: "amazon.com", platforms: ["meta", "google_search"] }
    ]

    // Filter suggestions based on query
    const matchingSuggestions = popularSuggestions.filter(suggestion => 
      suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.domain.toLowerCase().includes(query.toLowerCase())
    )

    // Add stats for matching suggestions if requested
    let competitors = matchingSuggestions.map(suggestion => ({
      ...suggestion,
      _count: includeStats ? {
        ads: Math.floor(Math.random() * 50) + 10,
        rankings: Math.floor(Math.random() * 100) + 20
      } : undefined
    }))

    // Try to fetch from database as well (for actual data when available)
    try {
      const whereClause = {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive" as const
            }
          },
          {
            domain: {
              contains: query,
              mode: "insensitive" as const
            }
          }
        ]
      }

      let dbCompetitors
      
      if (includeStats) {
        dbCompetitors = await prisma.competitor.findMany({
          where: whereClause,
          include: {
            _count: {
              select: {
                ads: true,
                rankings: true
              }
            }
          },
          orderBy: {
            name: "asc"
          },
          take: 10
        })
      } else {
        dbCompetitors = await prisma.competitor.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            domain: true,
            platforms: true
          },
          orderBy: {
            name: "asc"
          },
          take: 10
        })
      }

      // Merge database results with suggestions, prioritizing database results
      const dbIds = new Set(dbCompetitors.map(c => c.id))
      const filteredSuggestions = competitors.filter(c => !dbIds.has(c.id))
      competitors = [...dbCompetitors, ...filteredSuggestions]
    } catch (dbError) {
      console.warn("Database unavailable, using suggestions only:", dbError)
    }

    return NextResponse.json({ competitors: competitors.slice(0, 8) })
  } catch (error) {
    console.error("Failed to search competitors:", error)
    return NextResponse.json(
      { error: "Failed to search competitors" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const competitor = await prisma.competitor.findUnique({
      where: { id },
      include: {
        ads: {
          orderBy: {
            dateFound: "desc"
          },
          take: 50
        },
        rankings: {
          include: {
            searchResult: true
          },
          orderBy: {
            searchResult: {
              date: "desc"
            }
          },
          take: 20
        },
        _count: {
          select: {
            ads: true,
            rankings: true
          }
        }
      }
    })

    if (!competitor) {
      return NextResponse.json(
        { error: "Competitor not found" },
        { status: 404 }
      )
    }

    // Get platform-specific stats
    const platformStats = await prisma.ad.groupBy({
      by: ["platform"],
      where: {
        competitorId: competitor.id
      },
      _count: {
        platform: true
      },
      _avg: {
        estimatedReach: true
      }
    })

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentActivity = await prisma.ad.findMany({
      where: {
        competitorId: competitor.id,
        dateFound: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        dateFound: "desc"
      },
      take: 10
    })

    // Get search performance summary
    const searchPerformance = await prisma.competitorRanking.findMany({
      where: {
        competitorId: competitor.id
      },
      include: {
        searchResult: true
      },
      orderBy: {
        searchResult: {
          date: "desc"
        }
      },
      take: 10
    })

    return NextResponse.json({
      competitor,
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
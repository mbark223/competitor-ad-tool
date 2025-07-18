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

    let competitors
    
    if (includeStats) {
      competitors = await prisma.competitor.findMany({
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
        take: 20
      })
    } else {
      competitors = await prisma.competitor.findMany({
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
        take: 20
      })
    }

    return NextResponse.json({ competitors })
  } catch (error) {
    console.error("Failed to search competitors:", error)
    return NextResponse.json(
      { error: "Failed to search competitors" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get("platform")
    const competitor = searchParams.get("competitor")
    const format = searchParams.get("format")
    const isActive = searchParams.get("isActive")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {}

    if (platform) {
      where.platform = platform
    }

    if (competitor) {
      where.competitor = {
        name: {
          contains: competitor,
          mode: "insensitive"
        }
      }
    }

    if (format) {
      where.format = format
    }

    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          competitor: {
            select: {
              name: true,
              domain: true
            }
          }
        },
        orderBy: {
          dateFound: "desc"
        },
        take: limit,
        skip: offset
      }),
      prisma.ad.count({ where })
    ])

    return NextResponse.json({
      ads,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Failed to fetch ads:", error)
    return NextResponse.json(
      { error: "Failed to fetch ads" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitorId, platform, text, creativeUrl, format, estimatedReach, metadata } = body

    if (!competitorId || !platform || !text || !format) {
      return NextResponse.json(
        { error: "Missing required fields: competitorId, platform, text, format" },
        { status: 400 }
      )
    }

    const ad = await prisma.ad.create({
      data: {
        competitorId,
        platform,
        text,
        creativeUrl,
        format,
        estimatedReach,
        metadata: metadata || {},
        competitor: {
          connect: { id: competitorId }
        }
      },
      include: {
        competitor: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error("Failed to create ad:", error)
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    )
  }
}
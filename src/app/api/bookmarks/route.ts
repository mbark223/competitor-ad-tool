import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || "default-user" // For now, use a default user
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          ad: {
            include: {
              competitor: {
                select: {
                  name: true,
                  domain: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: limit,
        skip: offset
      }),
      prisma.bookmark.count({ where: { userId } })
    ])

    return NextResponse.json({
      bookmarks,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default-user", adId, notes } = body

    if (!adId) {
      return NextResponse.json(
        { error: "Missing required field: adId" },
        { status: 400 }
      )
    }

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id: adId }
    })

    if (!ad) {
      return NextResponse.json(
        { error: "Ad not found" },
        { status: 404 }
      )
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        adId
      }
    })

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Ad is already bookmarked" },
        { status: 409 }
      )
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        adId,
        notes
      },
      include: {
        ad: {
          include: {
            competitor: {
              select: {
                name: true,
                domain: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error("Failed to create bookmark:", error)
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      )
    }

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: { notes },
      include: {
        ad: {
          include: {
            competitor: {
              select: {
                name: true,
                domain: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error("Failed to update bookmark:", error)
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const userId = searchParams.get("userId") || "default-user"
    const adId = searchParams.get("adId")

    if (id) {
      // Delete by bookmark ID
      await prisma.bookmark.delete({
        where: { id }
      })
    } else if (adId) {
      // Delete by userId and adId combination
      await prisma.bookmark.deleteMany({
        where: {
          userId,
          adId
        }
      })
    } else {
      return NextResponse.json(
        { error: "Either id or adId parameter is required" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete bookmark:", error)
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    )
  }
}
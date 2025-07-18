import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      include: {
        _count: {
          select: {
            ads: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(competitors)
  } catch (error) {
    console.error("Failed to fetch competitors:", error)
    return NextResponse.json(
      { error: "Failed to fetch competitors" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, domain, platforms } = body

    if (!name || !domain) {
      return NextResponse.json(
        { error: "Missing required fields: name, domain" },
        { status: 400 }
      )
    }

    const competitor = await prisma.competitor.create({
      data: {
        name,
        domain,
        platforms: platforms || []
      }
    })

    return NextResponse.json(competitor, { status: 201 })
  } catch (error) {
    console.error("Failed to create competitor:", error)
    return NextResponse.json(
      { error: "Failed to create competitor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, domain, platforms } = body

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      )
    }

    const competitor = await prisma.competitor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(platforms && { platforms })
      }
    })

    return NextResponse.json(competitor)
  } catch (error) {
    console.error("Failed to update competitor:", error)
    return NextResponse.json(
      { error: "Failed to update competitor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      )
    }

    await prisma.competitor.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete competitor:", error)
    return NextResponse.json(
      { error: "Failed to delete competitor" },
      { status: 500 }
    )
  }
}
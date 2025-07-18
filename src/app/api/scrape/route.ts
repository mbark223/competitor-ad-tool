import { NextRequest, NextResponse } from "next/server"
import { getTwitterAds } from "@/lib/scrapers/twitter-scraper"
import { getSnapchatAds } from "@/lib/scrapers/snapchat-scraper"
import { getGoogleSerpData } from "@/lib/scrapers/google-serp-scraper"
import { prisma } from "@/lib/database/prisma"
import { USState } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      platforms = [], 
      competitors = [], 
      keywords = [], 
      states = [USState.CA, USState.TX, USState.FL, USState.NY, USState.IL] 
    } = body

    if (platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform is required" },
        { status: 400 }
      )
    }

    const results = {
      twitter: { ads: 0, success: false, error: null },
      snapchat: { ads: 0, success: false, error: null },
      google: { searchResults: 0, success: false, error: null },
      totalProcessed: 0
    }

    // Twitter scraping
    if (platforms.includes("twitter") && competitors.length > 0) {
      try {
        const twitterAds = await getTwitterAds(competitors)
        
        for (const ad of twitterAds) {
          try {
            await prisma.competitor.upsert({
              where: { name: ad.competitorId },
              update: {
                platforms: {
                  push: "twitter"
                }
              },
              create: {
                name: ad.competitorId,
                domain: `${ad.competitorId.toLowerCase()}.com`,
                platforms: ["twitter"]
              }
            })

            await prisma.ad.upsert({
              where: { id: ad.id },
              update: {
                text: ad.text,
                isActive: ad.isActive,
                estimatedReach: ad.estimatedReach,
                metadata: ad.metadata as any
              },
              create: {
                id: ad.id,
                competitorId: ad.competitorId,
                platform: ad.platform,
                creativeUrl: ad.creativeUrl,
                text: ad.text,
                dateFound: ad.dateFound,
                estimatedReach: ad.estimatedReach,
                format: ad.format,
                isActive: ad.isActive,
                metadata: ad.metadata as any,
                competitor: {
                  connect: { name: ad.competitorId }
                }
              }
            })
            results.twitter.ads++
          } catch (dbError) {
            console.error(`Failed to store Twitter ad ${ad.id}:`, dbError)
          }
        }
        
        results.twitter.success = true
      } catch (error) {
        results.twitter.error = error instanceof Error ? error.message : String(error)
      }
    }

    // Snapchat scraping
    if (platforms.includes("snapchat") && competitors.length > 0) {
      try {
        const snapchatAds = await getSnapchatAds(competitors)
        
        for (const ad of snapchatAds) {
          try {
            await prisma.competitor.upsert({
              where: { name: ad.competitorId },
              update: {
                platforms: {
                  push: "snapchat"
                }
              },
              create: {
                name: ad.competitorId,
                domain: `${ad.competitorId.toLowerCase()}.com`,
                platforms: ["snapchat"]
              }
            })

            await prisma.ad.upsert({
              where: { id: ad.id },
              update: {
                text: ad.text,
                isActive: ad.isActive,
                estimatedReach: ad.estimatedReach,
                metadata: ad.metadata as any
              },
              create: {
                id: ad.id,
                competitorId: ad.competitorId,
                platform: ad.platform,
                creativeUrl: ad.creativeUrl,
                text: ad.text,
                dateFound: ad.dateFound,
                estimatedReach: ad.estimatedReach,
                format: ad.format,
                isActive: ad.isActive,
                metadata: ad.metadata as any,
                competitor: {
                  connect: { name: ad.competitorId }
                }
              }
            })
            results.snapchat.ads++
          } catch (dbError) {
            console.error(`Failed to store Snapchat ad ${ad.id}:`, dbError)
          }
        }
        
        results.snapchat.success = true
      } catch (error) {
        results.snapchat.error = error instanceof Error ? error.message : String(error)
      }
    }

    // Google SERP scraping
    if (platforms.includes("google") && keywords.length > 0) {
      try {
        const searchResults = await getGoogleSerpData(keywords, states)
        
        for (const searchResult of searchResults) {
          try {
            const storedSearchResult = await prisma.searchResult.create({
              data: {
                keyword: searchResult.keyword,
                state: searchResult.state,
                date: searchResult.date,
                serpScreenshot: searchResult.serpScreenshot
              }
            })

            for (const ranking of searchResult.rankings) {
              await prisma.competitor.upsert({
                where: { name: ranking.competitorId },
                update: {
                  platforms: {
                    push: "google_search"
                  }
                },
                create: {
                  name: ranking.competitorId,
                  domain: ranking.competitorId.includes(".") ? ranking.competitorId : `${ranking.competitorId.toLowerCase()}.com`,
                  platforms: ["google_search"]
                }
              })

              await prisma.competitorRanking.create({
                data: {
                  competitorId: ranking.competitorId,
                  searchResultId: storedSearchResult.id,
                  position: ranking.position,
                  adCopy: ranking.adCopy,
                  url: ranking.url,
                  competitor: {
                    connect: { name: ranking.competitorId }
                  },
                  searchResult: {
                    connect: { id: storedSearchResult.id }
                  }
                }
              })
            }
            
            results.google.searchResults++
          } catch (dbError) {
            console.error(`Failed to store search result for ${searchResult.keyword}:`, dbError)
          }
        }
        
        results.google.success = true
      } catch (error) {
        results.google.error = error instanceof Error ? error.message : String(error)
      }
    }

    results.totalProcessed = results.twitter.ads + results.snapchat.ads + results.google.searchResults

    return NextResponse.json({
      success: true,
      message: `Successfully scraped data from ${platforms.join(", ")}`,
      results
    })

  } catch (error) {
    console.error("Scraping endpoint error:", error)
    return NextResponse.json(
      { 
        error: "Failed to scrape data",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
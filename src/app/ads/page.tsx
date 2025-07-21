"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Grid, List } from "lucide-react"
import Image from "next/image"

interface SimpleAd {
  id: string
  competitorName: string
  platform: string
  creativeUrl: string
  dateFound: string
  estimatedReach: number
  format: string
  isActive: boolean
}

export default function AdsPage() {
  const [ads, setAds] = useState<SimpleAd[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const mockAds: SimpleAd[] = [
          {
            id: "1",
            competitorName: "Caesars Palace",
            platform: "meta",
            creativeUrl: "https://picsum.photos/400/300?random=1",
            dateFound: "2 hours ago",
            estimatedReach: 15000,
            format: "image",
            isActive: true
          },
          {
            id: "2",
            competitorName: "DraftKings",
            platform: "twitter",
            creativeUrl: "https://picsum.photos/400/300?random=2",
            dateFound: "4 hours ago",
            estimatedReach: 8500,
            format: "image",
            isActive: true
          },
          {
            id: "3",
            competitorName: "FanDuel",
            platform: "snapchat",
            creativeUrl: "https://picsum.photos/400/600?random=3",
            dateFound: "6 hours ago",
            estimatedReach: 12000,
            format: "video",
            isActive: true
          },
          {
            id: "4",
            competitorName: "BetMGM",
            platform: "meta",
            creativeUrl: "https://picsum.photos/800/400?random=4",
            dateFound: "8 hours ago",
            estimatedReach: 25000,
            format: "carousel",
            isActive: false
          },
          {
            id: "5",
            competitorName: "Nike",
            platform: "google_search",
            creativeUrl: "https://picsum.photos/400/200?random=5",
            dateFound: "12 hours ago",
            estimatedReach: 18000,
            format: "text",
            isActive: true
          }
        ]
        
        setAds(mockAds)
      } catch (error) {
        console.error("Failed to fetch ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "meta":
        return "bg-blue-100 text-blue-800"
      case "twitter":
        return "bg-sky-100 text-sky-800"
      case "snapchat":
        return "bg-yellow-100 text-yellow-800"
      case "google_search":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid gap-4 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meta Ad Library</h1>
          <p className="text-muted-foreground">
            Browse and analyze Facebook & Instagram ads
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="flex rounded-lg border">
            <Button variant="default" size="sm" className="rounded-r-none">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-l-none">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {ads.length} ads
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={getPlatformColor(ad.platform)}>
                  {ad.platform}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {ad.competitorName}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="relative aspect-video mb-4 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={ad.creativeUrl}
                  alt="Ad creative"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://placehold.co/400x300/cccccc/666666?text=${encodeURIComponent(ad.competitorName)}`
                  }}
                />
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div>Found {ad.dateFound}</div>
                <div>Estimated reach: {ad.estimatedReach.toLocaleString()}</div>
                <div>Format: {ad.format}</div>
                <div>Status: {ad.isActive ? "Active" : "Inactive"}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ad, Platform } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Eye, Calendar } from "lucide-react"
import Image from "next/image"

interface PlatformActivityProps {
  ads: Ad[]
  platformStats: {
    platform: string
    _count: {
      platform: number
    }
  }[]
}

export function PlatformActivity({ ads, platformStats }: PlatformActivityProps) {
  const groupedAds = ads.reduce((acc, ad) => {
    if (!acc[ad.platform]) {
      acc[ad.platform] = []
    }
    acc[ad.platform].push(ad)
    return acc
  }, {} as Record<string, Ad[]>)

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case Platform.META:
        return "bg-blue-100 text-blue-800"
      case Platform.TWITTER:
        return "bg-sky-100 text-sky-800"
      case Platform.SNAPCHAT:
        return "bg-yellow-100 text-yellow-800"
      case Platform.GOOGLE_SEARCH:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case Platform.META:
        return "Meta"
      case Platform.TWITTER:
        return "Twitter"
      case Platform.SNAPCHAT:
        return "Snapchat"
      case Platform.GOOGLE_SEARCH:
        return "Google"
      default:
        return platform
    }
  }

  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No advertising activity found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat) => (
          <Card key={stat.platform}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getPlatformDisplayName(stat.platform)}
              </CardTitle>
              <Badge className={getPlatformColor(stat.platform)}>
                {stat._count.platform}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat._count.platform}</div>
              <p className="text-xs text-muted-foreground">
                ads tracked
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform-specific Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedAds)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(groupedAds).map((platform) => (
                <TabsTrigger key={platform} value={platform}>
                  {getPlatformDisplayName(platform)} ({groupedAds[platform].length})
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(groupedAds).map(([platform, platformAds]) => (
              <TabsContent key={platform} value={platform} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {platformAds.slice(0, 12).map((ad) => (
                    <div key={ad.id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={ad.imageUrl || `https://picsum.photos/400/300?random=${ad.id}`}
                          alt="Ad creative"
                          fill
                          className="object-cover"
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `https://placehold.co/400x300/e5e7eb/6b7280?text=${encodeURIComponent(getPlatformDisplayName(platform))}`
                          }}
                        />
                        {ad.format === "video" && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            VIDEO
                          </div>
                        )}
                        {ad.format === "carousel" && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            CAROUSEL
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getPlatformColor(ad.platform)} variant="secondary">
                            {getPlatformDisplayName(ad.platform)}
                          </Badge>
                          {!ad.isActive && (
                            <Badge variant="destructive" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(ad.dateFound).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {platformAds.length > 12 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing 12 of {platformAds.length} ads on {getPlatformDisplayName(platform)}
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
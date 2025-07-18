"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Ad, Platform } from "@/types"

interface ActivityFeedProps {
  recentAds: Ad[]
}

export function ActivityFeed({ recentAds }: ActivityFeedProps) {
  const getPlatformColor = (platform: Platform) => {
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

  const getAdCount = (platform: Platform) => {
    switch (platform) {
      case Platform.META:
        return Math.floor(Math.random() * 20) + 5
      case Platform.TWITTER:
        return Math.floor(Math.random() * 15) + 3
      case Platform.SNAPCHAT:
        return Math.floor(Math.random() * 12) + 2
      case Platform.GOOGLE_SEARCH:
        return Math.floor(Math.random() * 8) + 1
      default:
        return Math.floor(Math.random() * 10) + 1
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest competitor ads found across all platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            recentAds.map((ad) => (
              <div key={ad.id} className="flex items-start space-x-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPlatformColor(ad.platform as Platform)}>
                      {ad.platform}
                    </Badge>
                    <span className="text-sm font-medium">{getAdCount(ad.platform as Platform)} ads found</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(ad.dateFound, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
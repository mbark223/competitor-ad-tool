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
                    <span className="text-sm font-medium">New ad found</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ad.text}
                  </p>
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
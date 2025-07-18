"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Calendar } from "lucide-react"
import { Ad, Platform } from "@/types"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface AdCardProps {
  ad: Ad
  onBookmark?: (adId: string) => void
  isBookmarked?: boolean
}

export function AdCard({ ad, onBookmark, isBookmarked = false }: AdCardProps) {
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
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getPlatformColor(ad.platform as Platform)}>
            {ad.platform}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark?.(ad.id)}
            className={isBookmarked ? "text-yellow-600" : "text-muted-foreground"}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {ad.creativeUrl && (
          <div className="relative aspect-video mb-4 bg-muted rounded-lg overflow-hidden">
            <Image
              src={ad.creativeUrl}
              alt="Ad creative"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          </div>
        )}

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Found {formatDistanceToNow(ad.dateFound, { addSuffix: true })}</span>
          </div>
          {ad.estimatedReach && (
            <div>Estimated reach: {ad.estimatedReach.toLocaleString()}</div>
          )}
          <div>Format: {ad.format}</div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="mr-2 h-3 w-3" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
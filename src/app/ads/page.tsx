"use client"

import { useState, useEffect } from "react"
import { AdCard } from "@/components/ads/ad-card"
// import { AdFilters } from "@/components/ads/ad-filters"
import { Button } from "@/components/ui/button"
import { Ad, AdFilter, Platform, AdFormat } from "@/types"
import { Download, Grid, List } from "lucide-react"

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [filteredAds, setFilteredAds] = useState<Ad[]>([])
  const [filters, setFilters] = useState<AdFilter>({})
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [bookmarkedAds, setBookmarkedAds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulated data for now
        const mockAds: Ad[] = [
          {
            id: "1",
            competitorId: "caesars",
            competitorName: "Caesars Palace",
            platform: "meta" as Platform,
            creativeUrl: "https://via.placeholder.com/400x300?text=Caesars+Meta+Ad",
            text: "Transform your business with our cutting-edge AI solutions.",
            dateFound: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            estimatedReach: 15000,
            format: "image" as AdFormat,
            isActive: true
          },
          {
            id: "2",
            competitorId: "draftkings",
            competitorName: "DraftKings",
            platform: "twitter" as Platform,
            creativeUrl: "https://via.placeholder.com/400x300?text=DraftKings+Twitter+Ad",
            text: "Limited time offer: Get 3 months free when you sign up for our premium plan.",
            dateFound: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            estimatedReach: 8500,
            format: "image" as AdFormat,
            isActive: true
          },
          {
            id: "3",
            competitorId: "fanduel",
            competitorName: "FanDuel",
            platform: "snapchat" as Platform,
            creativeUrl: "https://via.placeholder.com/400x600?text=FanDuel+Snapchat+Ad",
            text: "Ready to level up? Our new app feature makes everything easier.",
            dateFound: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            estimatedReach: 12000,
            format: "video" as AdFormat,
            isActive: true
          },
          {
            id: "4",
            competitorId: "betmgm",
            competitorName: "BetMGM",
            platform: "meta" as Platform,
            creativeUrl: "https://via.placeholder.com/800x400?text=BetMGM+Meta+Carousel",
            text: "Black Friday Sale! Up to 70% off all products.",
            dateFound: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            estimatedReach: 25000,
            format: "carousel" as AdFormat,
            isActive: false
          },
          {
            id: "5",
            competitorId: "nike",
            competitorName: "Nike",
            platform: "google_search" as Platform,
            creativeUrl: "https://via.placeholder.com/400x200?text=Nike+Google+Ad",
            text: "Professional services you can trust. 20+ years of experience.",
            dateFound: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            estimatedReach: 18000,
            format: "text" as AdFormat,
            isActive: true
          }
        ]
        
        setAds(mockAds)
        setFilteredAds(mockAds)
      } catch (error) {
        console.error("Failed to fetch ads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  useEffect(() => {
    let filtered = [...ads]

    if (filters.competitor) {
      filtered = filtered.filter(ad =>
        ad.competitorId.toLowerCase().includes(filters.competitor!.toLowerCase())
      )
    }

    if (filters.platform) {
      filtered = filtered.filter(ad => ad.platform === filters.platform)
    }

    if (filters.format) {
      filtered = filtered.filter(ad => ad.format === filters.format)
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(ad => ad.isActive === filters.isActive)
    }

    if (filters.dateRange) {
      filtered = filtered.filter(ad => {
        const adDate = new Date(ad.dateFound)
        return adDate >= filters.dateRange!.start && adDate <= filters.dateRange!.end
      })
    }

    setFilteredAds(filtered)
  }, [ads, filters])

  const handleBookmark = (adId: string) => {
    setBookmarkedAds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(adId)) {
        newSet.delete(adId)
      } else {
        newSet.add(adId)
      }
      return newSet
    })
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log("Exporting ads to CSV...")
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
          <h1 className="text-3xl font-bold tracking-tight">Ad Explorer</h1>
          <p className="text-muted-foreground">
            Browse and analyze competitor ads across all platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          {/* Filters temporarily disabled for debugging */}
          <div className="text-sm text-muted-foreground">
            Filters coming soon...
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAds.length} of {ads.length} ads
            </p>
          </div>

          {filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ads found matching your filters</p>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }>
              {filteredAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkedAds.has(ad.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
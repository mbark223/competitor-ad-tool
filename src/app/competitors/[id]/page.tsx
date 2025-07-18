"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlatformActivity } from "@/components/competitor/platform-activity"
import { SearchPerformance } from "@/components/competitor/search-performance"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Globe, Calendar, BarChart3, Search, ExternalLink, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CompetitorProfile {
  competitor: {
    id: string
    name: string
    domain: string
    platforms: string[]
    createdAt: string
    updatedAt: string
    ads: any[]
    rankings: any[]
    _count: {
      ads: number
      rankings: number
    }
  }
  platformStats: any[]
  recentActivity: any[]
  searchPerformance: any[]
  totalAds: number
  totalSearchAppearances: number
}

export default function CompetitorProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<CompetitorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCompetitorProfile(params.id as string)
    }
  }, [params.id])

  const fetchCompetitorProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/competitors/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        console.error("Failed to fetch competitor profile")
      }
    } catch (error) {
      console.error("Error fetching competitor profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!params.id) return
    
    setRefreshing(true)
    await fetchCompetitorProfile(params.id as string)
    setRefreshing(false)
  }

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
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Competitor not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{profile.competitor.name}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{profile.competitor.domain}</span>
              <span>•</span>
              <span>Tracking since {formatDistanceToNow(new Date(profile.competitor.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Site
          </Button>
        </div>
      </div>

      {/* Platforms */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Active on:</span>
        {profile.competitor.platforms.map((platform) => (
          <Badge key={platform} className={getPlatformColor(platform)}>
            {platform}
          </Badge>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.totalAds}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Appearances</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.totalSearchAppearances}</div>
            <p className="text-xs text-muted-foreground">
              In search results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.competitor.platforms.length}</div>
            <p className="text-xs text-muted-foreground">
              Active platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.recentActivity.length > 0 
                ? formatDistanceToNow(new Date(profile.recentActivity[0].dateFound), { addSuffix: true }).replace("ago", "")
                : "None"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Latest ad found
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="ads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ads">Advertising Activity</TabsTrigger>
          <TabsTrigger value="search">Search Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ads" className="space-y-6">
          <PlatformActivity 
            ads={profile.competitor.ads}
            platformStats={profile.platformStats}
          />
        </TabsContent>
        
        <TabsContent value="search" className="space-y-6">
          <SearchPerformance rankings={profile.searchPerformance} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
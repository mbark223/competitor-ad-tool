"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Eye, Target, TrendingUp, Users } from "lucide-react"
import { DashboardStats, Ad } from "@/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAds: 0,
    activeCompetitors: 0,
    newAdsToday: 0,
    searchPositionChanges: 0
  })
  const [recentAds, setRecentAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        // Simulated data for now
        setStats({
          totalAds: 1247,
          activeCompetitors: 12,
          newAdsToday: 23,
          searchPositionChanges: 8
        })
        
        setRecentAds([
          {
            id: "1",
            competitorId: "comp1",
            platform: "meta",
            text: "Limited time offer! Get 50% off your first month with our premium service. Don't miss out on this exclusive deal.",
            dateFound: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            format: "image",
            isActive: true
          },
          {
            id: "2",
            competitorId: "comp2",
            platform: "twitter",
            text: "Revolutionary new product launch! Experience the future of technology with our latest innovation.",
            dateFound: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            format: "video",
            isActive: true
          },
          {
            id: "3",
            competitorId: "comp3",
            platform: "snapchat",
            text: "Join thousands of satisfied customers. Start your journey today with our award-winning platform.",
            dateFound: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            format: "image",
            isActive: true
          }
        ])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor competitor activity and track performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Ads Tracked"
          value={stats.totalAds}
          description="Across all platforms"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Competitors"
          value={stats.activeCompetitors}
          description="Currently monitored"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="New Ads Today"
          value={stats.newAdsToday}
          description="Found in last 24 hours"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Position Changes"
          value={stats.searchPositionChanges}
          description="Search ranking updates"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed recentAds={recentAds} />
        
        <div className="space-y-6">
          {/* Quick Actions - placeholder for future features */}
          <div className="text-sm text-muted-foreground">
            More dashboard widgets coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}
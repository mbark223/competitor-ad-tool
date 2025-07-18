"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, TrendingUp, AlertCircle } from "lucide-react"

interface BrandRanking {
  id: string
  keyword: string
  state: string
  position: number | null
  adCopy: string
  url: string
  date: string
  isActive: boolean
}

export default function SearchPage() {
  const [company, setCompany] = useState("")
  const [keyword, setKeyword] = useState("")
  const [rankings, setRankings] = useState<BrandRanking[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Mock data for different brand/keyword combinations
  const mockRankings: Record<string, Record<string, BrandRanking[]>> = {
    "caesars": {
      "online casino": [
        {
          id: "1",
          keyword: "online casino",
          state: "CA",
          position: 1,
          adCopy: "Get $100 in Casino Credits when you sign up - Caesars Palace",
          url: "https://caesars.com/casino",
          date: "2 hours ago",
          isActive: true
        },
        {
          id: "2",
          keyword: "online casino",
          state: "TX",
          position: 2,
          adCopy: "Play premium slots at Caesars Palace Online Casino",
          url: "https://caesars.com/casino",
          date: "2 hours ago",
          isActive: true
        },
        {
          id: "3",
          keyword: "online casino",
          state: "NY",
          position: 4,
          adCopy: "New York's premium online casino - Caesars Palace",
          url: "https://caesars.com/casino",
          date: "3 hours ago",
          isActive: true
        }
      ],
      "casino games": [
        {
          id: "4",
          keyword: "casino games",
          state: "CA",
          position: 1,
          adCopy: "Play your favorite slots with 200% bonus - Caesars",
          url: "https://caesars.com/games",
          date: "1 hour ago",
          isActive: true
        },
        {
          id: "5",
          keyword: "casino games",
          state: "FL",
          position: 3,
          adCopy: "Experience luxury gaming at Caesars Palace",
          url: "https://caesars.com/games",
          date: "4 hours ago",
          isActive: true
        }
      ],
      "sports betting": [
        {
          id: "6",
          keyword: "sports betting",
          state: "CA",
          position: null,
          adCopy: "",
          url: "",
          date: "5 hours ago",
          isActive: false
        },
        {
          id: "7",
          keyword: "sports betting",
          state: "TX",
          position: 7,
          adCopy: "Bet on sports with Caesars Sportsbook",
          url: "https://caesars.com/sportsbook",
          date: "1 hour ago",
          isActive: true
        }
      ]
    },
    "draftkings": {
      "sports betting": [
        {
          id: "8",
          keyword: "sports betting",
          state: "CA",
          position: 1,
          adCopy: "Bet $5, Get $150 in bonus bets - DraftKings",
          url: "https://draftkings.com",
          date: "1 hour ago",
          isActive: true
        },
        {
          id: "9",
          keyword: "sports betting",
          state: "TX",
          position: 2,
          adCopy: "NFL betting with DraftKings - Place your bets now",
          url: "https://draftkings.com",
          date: "2 hours ago",
          isActive: true
        }
      ],
      "daily fantasy": [
        {
          id: "10",
          keyword: "daily fantasy",
          state: "CA",
          position: 1,
          adCopy: "Win big with daily fantasy football - DraftKings",
          url: "https://draftkings.com/fantasy",
          date: "3 hours ago",
          isActive: true
        }
      ],
      "online casino": [
        {
          id: "11",
          keyword: "online casino",
          state: "CA",
          position: null,
          adCopy: "",
          url: "",
          date: "4 hours ago",
          isActive: false
        }
      ]
    },
    "nike": {
      "running shoes": [
        {
          id: "12",
          keyword: "running shoes",
          state: "CA",
          position: 1,
          adCopy: "Just Do It - Nike Air Max running shoes",
          url: "https://nike.com/running",
          date: "1 hour ago",
          isActive: true
        },
        {
          id: "13",
          keyword: "running shoes",
          state: "TX",
          position: 2,
          adCopy: "Premium running shoes - Nike Air Zoom",
          url: "https://nike.com/running",
          date: "2 hours ago",
          isActive: true
        }
      ],
      "basketball shoes": [
        {
          id: "14",
          keyword: "basketball shoes",
          state: "CA",
          position: 1,
          adCopy: "Nike Air Jordan - Performance basketball shoes",
          url: "https://nike.com/basketball",
          date: "1 hour ago",
          isActive: true
        }
      ]
    }
  }

  const handleSearch = async () => {
    if (!company || !keyword) return

    setLoading(true)
    setSearched(true)

    // Simulate API call
    setTimeout(() => {
      const companyKey = company.toLowerCase().replace(/\s+/g, '')
      const keywordKey = keyword.toLowerCase()
      
      const companyData = mockRankings[companyKey]
      const keywordData = companyData?.[keywordKey] || []
      
      setRankings(keywordData)
      setLoading(false)
    }, 1000)
  }

  const getPositionColor = (position: number | null) => {
    if (!position) return "bg-gray-100 text-gray-800"
    if (position <= 3) return "bg-green-100 text-green-800"
    if (position <= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getPositionText = (position: number | null) => {
    if (!position) return "Not ranking"
    return `#${position}`
  }

  const getAveragePosition = () => {
    const activeRankings = rankings.filter(r => r.position)
    if (activeRankings.length === 0) return null
    const sum = activeRankings.reduce((acc, r) => acc + (r.position || 0), 0)
    return Math.round(sum / activeRankings.length)
  }

  const getActiveStates = () => {
    return rankings.filter(r => r.position).length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Intelligence</h1>
          <p className="text-muted-foreground">
            Search how any brand ranks for specific keywords across different markets
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Brand & Keyword Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g., Caesars, DraftKings, Nike"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                placeholder="e.g., online casino, sports betting"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={loading || !company || !keyword}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Rankings
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {searched && (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Position</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getAveragePosition() ? `#${getAveragePosition()}` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all markets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getActiveStates()}/{rankings.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  States with rankings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keyword</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {keyword || "None"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Search term
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {company} Rankings for "{keyword}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankings.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-muted-foreground">
                    No rankings found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try searching for a different company or keyword combination.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rankings.map((ranking) => (
                    <div key={ranking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={getPositionColor(ranking.position)}>
                          {getPositionText(ranking.position)}
                        </Badge>
                        <div>
                          <div className="font-medium">{ranking.state}</div>
                          <div className="text-sm text-muted-foreground">
                            {ranking.date}
                          </div>
                        </div>
                        <div className="flex-1 max-w-md">
                          {ranking.adCopy ? (
                            <div className="text-sm line-clamp-2">
                              {ranking.adCopy}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">
                              No ad found
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {ranking.url || "No URL"}
                        </div>
                        <div className="mt-1">
                          <Badge variant={ranking.isActive ? "default" : "secondary"}>
                            {ranking.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Help Section */}
      {!searched && (
        <Card>
          <CardHeader>
            <CardTitle>How to Use Search Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>1. Enter a Company Name:</strong> Type any brand you want to analyze (e.g., "Caesars", "DraftKings", "Nike")
              </div>
              <div>
                <strong>2. Enter a Keyword:</strong> Add the search term you want to check rankings for (e.g., "online casino", "sports betting", "running shoes")
              </div>
              <div>
                <strong>3. View Rankings:</strong> See how that brand ranks for that keyword across different states, including their ad copy and position
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <strong>Example searches:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Caesars + "online casino"</li>
                  <li>• DraftKings + "sports betting"</li>
                  <li>• Nike + "running shoes"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
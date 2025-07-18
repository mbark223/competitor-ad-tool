"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, MapPin, Search } from "lucide-react"

interface SimpleSearchResult {
  id: string
  keyword: string
  state: string
  date: string
  rankings: Array<{
    id: string
    competitorName: string
    position: number
    adCopy: string
    url: string
  }>
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SimpleSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const mockResults: SimpleSearchResult[] = [
          {
            id: "1",
            keyword: "online casino",
            state: "CA",
            date: "2 hours ago",
            rankings: [
              {
                id: "r1",
                competitorName: "Caesars Palace",
                position: 1,
                adCopy: "Get $100 in Casino Credits when you sign up",
                url: "https://caesars.com/casino"
              },
              {
                id: "r2", 
                competitorName: "BetMGM",
                position: 3,
                adCopy: "Risk-Free Bet up to $1000 - Join Now",
                url: "https://betmgm.com/casino"
              }
            ]
          },
          {
            id: "2",
            keyword: "sports betting",
            state: "TX",
            date: "4 hours ago",
            rankings: [
              {
                id: "r3",
                competitorName: "DraftKings",
                position: 2,
                adCopy: "Bet $5, Get $150 in bonus bets",
                url: "https://draftkings.com"
              },
              {
                id: "r4",
                competitorName: "FanDuel",
                position: 4,
                adCopy: "Same Game Parlay - Boost your winnings",
                url: "https://fanduel.com"
              }
            ]
          },
          {
            id: "3",
            keyword: "daily fantasy sports",
            state: "FL",
            date: "6 hours ago",
            rankings: [
              {
                id: "r5",
                competitorName: "FanDuel",
                position: 1,
                adCopy: "Win big with daily fantasy football",
                url: "https://fanduel.com/fantasy"
              },
              {
                id: "r6",
                competitorName: "DraftKings",
                position: 2,
                adCopy: "NFL DFS - Play for millions in prizes",
                url: "https://draftkings.com/fantasy"
              }
            ]
          },
          {
            id: "4",
            keyword: "casino games",
            state: "NY",
            date: "8 hours ago",
            rankings: [
              {
                id: "r7",
                competitorName: "Caesars Palace",
                position: 1,
                adCopy: "Play your favorite slots with 200% bonus",
                url: "https://caesars.com/games"
              }
            ]
          }
        ]
        
        setSearchResults(mockResults)
      } catch (error) {
        console.error("Failed to fetch search results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleExport = () => {
    console.log("Exporting search results...")
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return "bg-green-100 text-green-800"
    if (position <= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Search Intelligence</h1>
          <p className="text-muted-foreground">
            Monitor competitor search rankings across key markets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords Tracked</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchResults.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all states
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitors Found</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(searchResults.flatMap(r => r.rankings.map(rank => rank.competitorName))).size}
            </div>
            <p className="text-xs text-muted-foreground">
              In search results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Top Position</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #2
            </div>
            <p className="text-xs text-muted-foreground">
              Top competitor position
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Keyword Rankings</h2>
          <p className="text-sm text-muted-foreground">
            Current search positions for tracked keywords
          </p>
        </div>

        <div className="space-y-4">
          {searchResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{result.keyword}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {result.state} • {result.date}
                    </p>
                  </div>
                  <Badge variant="outline">{result.rankings.length} competitors</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.rankings.map((ranking) => (
                    <div key={ranking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getPositionColor(ranking.position)}>
                          #{ranking.position}
                        </Badge>
                        <div>
                          <div className="font-medium">{ranking.competitorName}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {ranking.adCopy}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {ranking.url}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
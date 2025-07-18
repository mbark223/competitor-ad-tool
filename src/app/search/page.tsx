"use client"

import { useState, useEffect } from "react"
import { StateSelector } from "@/components/search/state-selector"
import { KeywordRankings } from "@/components/search/keyword-rankings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchResult, USState, CompetitorRanking } from "@/types"
import { RefreshCw, Download, MapPin } from "lucide-react"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedState, setSelectedState] = useState<USState | "">("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulated data for now
        const mockResults: SearchResult[] = [
          {
            id: "1",
            keyword: "best insurance deals",
            state: USState.CA,
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            serpScreenshot: "screenshot1.png",
            rankings: [
              {
                id: "r1",
                competitorId: "comp1",
                searchResultId: "1",
                position: 1,
                adCopy: "Save up to 40% on car insurance. Get a free quote in minutes!",
                url: "https://competitor1.com/insurance"
              },
              {
                id: "r2", 
                competitorId: "comp2",
                searchResultId: "1",
                position: 3,
                adCopy: "Trusted by millions. Compare rates from top insurers.",
                url: "https://competitor2.com/compare"
              },
              {
                id: "r3",
                competitorId: "comp3",
                searchResultId: "1", 
                position: 7,
                adCopy: "24/7 customer support. Bundle and save more.",
                url: "https://competitor3.com/bundle"
              }
            ]
          },
          {
            id: "2",
            keyword: "cheap car insurance",
            state: USState.TX,
            date: new Date(Date.now() - 4 * 60 * 60 * 1000),
            rankings: [
              {
                id: "r4",
                competitorId: "comp2",
                searchResultId: "2",
                position: 2,
                adCopy: "Texas drivers save $500+ per year. Start saving today!",
                url: "https://competitor2.com/texas"
              },
              {
                id: "r5",
                competitorId: "comp4",
                searchResultId: "2",
                position: 4,
                adCopy: "Local Texas agency. Personal service, great rates.",
                url: "https://competitor4.com/local"
              }
            ]
          },
          {
            id: "3",
            keyword: "auto insurance quotes",
            state: USState.FL,
            date: new Date(Date.now() - 6 * 60 * 60 * 1000),
            rankings: [
              {
                id: "r6",
                competitorId: "comp1",
                searchResultId: "3",
                position: 2,
                adCopy: "Florida's #1 rated insurance company. Get your quote!",
                url: "https://competitor1.com/florida"
              },
              {
                id: "r7",
                competitorId: "comp3",
                searchResultId: "3",
                position: 5,
                adCopy: "Hurricane coverage included. Protect your car in Florida.",
                url: "https://competitor3.com/hurricane"
              }
            ]
          },
          {
            id: "4",
            keyword: "liability insurance",
            state: USState.NY,
            date: new Date(Date.now() - 8 * 60 * 60 * 1000),
            rankings: [
              {
                id: "r8",
                competitorId: "comp5",
                searchResultId: "4",
                position: 1,
                adCopy: "NY state minimum coverage starting at $29/month.",
                url: "https://competitor5.com/ny-minimum"
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
    // TODO: Implement actual refresh logic
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting search results...")
  }

  const getStatsForState = (state: USState | "") => {
    const filtered = state 
      ? searchResults.filter(r => r.state === state)
      : searchResults
    
    const totalKeywords = filtered.length
    const totalCompetitors = new Set(
      filtered.flatMap(r => r.rankings.map(rank => rank.competitorId))
    ).size
    const avgPosition = filtered.length > 0 
      ? filtered.reduce((sum, r) => sum + (r.rankings[0]?.position || 0), 0) / filtered.length
      : 0

    return { totalKeywords, totalCompetitors, avgPosition }
  }

  const stats = getStatsForState(selectedState)

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
          <StateSelector
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
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
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKeywords}</div>
            <p className="text-xs text-muted-foreground">
              {selectedState ? `In ${selectedState}` : "Across all states"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitors Found</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompetitors}</div>
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
              {stats.avgPosition > 0 ? `#${Math.round(stats.avgPosition)}` : "N/A"}
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
            {selectedState && ` in ${selectedState}`}
          </p>
        </div>

        <KeywordRankings 
          searchResults={searchResults}
          selectedState={selectedState}
        />
      </div>
    </div>
  )
}
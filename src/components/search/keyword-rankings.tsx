"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchResult, CompetitorRanking, USState } from "@/types"
import { ExternalLink, Camera, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface KeywordRankingsProps {
  searchResults: SearchResult[]
  selectedState: USState | ""
}

export function KeywordRankings({ searchResults, selectedState }: KeywordRankingsProps) {
  const filteredResults = selectedState 
    ? searchResults.filter(result => result.state === selectedState)
    : searchResults

  const getPositionTrend = (position: number) => {
    // Mock trend calculation - in real app, compare with previous results
    const previousPosition = position + Math.floor(Math.random() * 6) - 3
    
    if (position < previousPosition) {
      return { icon: TrendingUp, color: "text-green-600", change: previousPosition - position }
    } else if (position > previousPosition) {
      return { icon: TrendingDown, color: "text-red-600", change: position - previousPosition }
    }
    return { icon: Minus, color: "text-gray-400", change: 0 }
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return "bg-green-100 text-green-800"
    if (position <= 5) return "bg-yellow-100 text-yellow-800"
    if (position <= 10) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-4">
      {filteredResults.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No search results found for the selected state
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredResults.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">"{result.keyword}"</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{result.state}</Badge>
                  {result.serpScreenshot && (
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-3 w-3" />
                      SERP
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(result.date, { addSuffix: true })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.rankings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No competitors found in results</p>
                ) : (
                  result.rankings
                    .sort((a, b) => a.position - b.position)
                    .map((ranking: CompetitorRanking) => {
                      const trend = getPositionTrend(ranking.position)
                      const TrendIcon = trend.icon
                      
                      return (
                        <div
                          key={ranking.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge className={getPositionColor(ranking.position)}>
                              #{ranking.position}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                              {trend.change > 0 && (
                                <span className={`text-xs ${trend.color}`}>
                                  {trend.change}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Competitor {ranking.competitorId}</p>
                              {ranking.adCopy && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {ranking.adCopy}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
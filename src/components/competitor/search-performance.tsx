"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CompetitorRanking, SearchResult } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Search, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface SearchPerformanceProps {
  rankings: (CompetitorRanking & {
    searchResult: SearchResult
  })[]
}

export function SearchPerformance({ rankings }: SearchPerformanceProps) {
  const getPositionColor = (position: number) => {
    if (position <= 3) return "bg-green-100 text-green-800"
    if (position <= 5) return "bg-yellow-100 text-yellow-800"
    if (position <= 10) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

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

  // Group rankings by state for summary
  const stateStats = rankings.reduce((acc, ranking) => {
    const state = ranking.searchResult.state
    if (!acc[state]) {
      acc[state] = {
        appearances: 0,
        avgPosition: 0,
        bestPosition: Infinity,
        keywords: new Set<string>()
      }
    }
    acc[state].appearances++
    acc[state].avgPosition += ranking.position
    acc[state].bestPosition = Math.min(acc[state].bestPosition, ranking.position)
    acc[state].keywords.add(ranking.searchResult.keyword)
    return acc
  }, {} as Record<string, {
    appearances: number
    avgPosition: number
    bestPosition: number
    keywords: Set<string>
  }>)

  // Calculate averages
  Object.keys(stateStats).forEach(state => {
    stateStats[state].avgPosition = Math.round(stateStats[state].avgPosition / stateStats[state].appearances)
  })

  if (rankings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No search performance data found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* State Summary */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Object.entries(stateStats).map(([state, stats]) => (
          <Card key={state}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{state}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.bestPosition}</div>
              <p className="text-xs text-muted-foreground">
                Best position • Avg #{stats.avgPosition}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.keywords.size} keywords
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Recent Search Appearances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.slice(0, 15).map((ranking) => {
              const trend = getPositionTrend(ranking.position)
              const TrendIcon = trend.icon
              
              return (
                <div key={ranking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
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
                      <span className="font-medium">"{ranking.searchResult.keyword}"</span>
                      <Badge variant="outline">{ranking.searchResult.state}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(ranking.searchResult.date, { addSuffix: true })}
                    </span>
                  </div>
                  
                  {ranking.adCopy && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ranking.adCopy}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{ranking.url}</span>
                  </div>
                </div>
              )
            })}
            
            {rankings.length > 15 && (
              <p className="text-sm text-muted-foreground text-center">
                Showing 15 of {rankings.length} search appearances
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
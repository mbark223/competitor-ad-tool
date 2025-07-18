"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Competitor {
  id: string
  name: string
  domain: string
  platforms: string[]
  _count?: {
    ads: number
    rankings: number
  }
}

interface CompanySearchProps {
  onSelect?: (competitor: Competitor) => void
  placeholder?: string
  autoFocus?: boolean
}

export function CompanySearch({ 
  onSelect, 
  placeholder = "Search for a company (e.g., Caesars Palace Online Casino)",
  autoFocus = false 
}: CompanySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchCompetitors = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/competitors/search?q=${encodeURIComponent(query.trim())}&includeStats=true`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.competitors)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Failed to search competitors:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCompetitors, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (competitor: Competitor) => {
    if (onSelect) {
      onSelect(competitor)
    } else {
      router.push(`/competitors/${competitor.id}`)
    }
    setShowResults(false)
    setQuery("")
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

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowResults(true)}
          className="pl-10 pr-4"
          autoFocus={autoFocus}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-auto">
          <CardContent className="p-0">
            {results.map((competitor) => (
              <div
                key={competitor.id}
                className="flex items-center justify-between p-4 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelect(competitor)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{competitor.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{competitor.domain}</span>
                      {competitor._count && (
                        <>
                          <span>•</span>
                          <span>{competitor._count.ads} ads</span>
                          <span>•</span>
                          <span>{competitor._count.rankings} search results</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {competitor.platforms.slice(0, 3).map((platform) => (
                    <Badge key={platform} className={`${getPlatformColor(platform)} text-xs`}>
                      {platform}
                    </Badge>
                  ))}
                  {competitor.platforms.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-800 text-xs">
                      +{competitor.platforms.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && !loading && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            No companies found matching "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  )
}
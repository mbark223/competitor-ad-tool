"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Grid, List, Search, Loader2 } from "lucide-react"
import Image from "next/image"

interface MetaAd {
  id: string
  competitorId: string
  competitorName?: string
  platform: string
  creativeUrl: string
  text?: string
  dateFound: string
  estimatedReach?: number
  format: string
  isActive: boolean
  metadata?: any
}

// Popular brands on Meta platforms
const POPULAR_BRANDS = [
  "Nike", "Adidas", "Apple", "Samsung", "Coca-Cola", "Pepsi",
  "McDonald's", "Burger King", "KFC", "Subway", "Starbucks",
  "Amazon", "Walmart", "Target", "Best Buy", "Home Depot",
  "Netflix", "Disney", "Spotify", "YouTube", "TikTok",
  "Microsoft", "Google", "Meta", "Instagram", "WhatsApp",
  "Tesla", "Ford", "Toyota", "BMW", "Mercedes-Benz",
  "Caesars Palace", "DraftKings", "FanDuel", "BetMGM", "MGM Resorts",
  "Marriott", "Hilton", "Airbnb", "Booking.com", "Expedia",
  "American Airlines", "Delta", "United Airlines", "Southwest",
  "Visa", "Mastercard", "PayPal", "Square", "Stripe",
  "Louis Vuitton", "Gucci", "Chanel", "Hermès", "Prada",
  "Zara", "H&M", "Uniqlo", "Gap", "Forever 21",
  "Sephora", "Ulta", "MAC Cosmetics", "Maybelline", "L'Oréal"
]

export default function AdsPage() {
  const [ads, setAds] = useState<MetaAd[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchedCompany, setSearchedCompany] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchAds = async () => {
    if (!searchQuery.trim()) return
    
    setSearching(true)
    setAds([])
    
    try {
      const response = await fetch(`/api/ads/meta?pages=${encodeURIComponent(searchQuery)}&limit=50`)
      
      if (!response.ok) {
        throw new Error("Failed to search ads")
      }
      
      const data = await response.json()
      
      if (data.ads && data.ads.length > 0) {
        setAds(data.ads)
        setSearchedCompany(searchQuery)
      } else {
        // No ads found
        setAds([])
        setSearchedCompany(searchQuery)
      }
    } catch (error) {
      console.error("Failed to search ads:", error)
      setAds([])
    } finally {
      setSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false)
      searchAds()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    
    if (value.trim()) {
      // Filter brands that match the input
      const filtered = POPULAR_BRANDS.filter(brand => 
        brand.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8) // Show max 8 suggestions
      
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (brand: string) => {
    setSearchQuery(brand)
    setShowSuggestions(false)
    setTimeout(() => {
      searchAds()
    }, 100)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meta Ad Library</h1>
          <p className="text-muted-foreground">
            Browse and analyze Facebook & Instagram ads
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1" ref={searchInputRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by company name (e.g., Nike, Caesars Palace)"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (searchQuery.trim() && suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              className="pl-10"
            />
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                {suggestions.map((brand, index) => {
                  const highlightMatch = (text: string) => {
                    const regex = new RegExp(`(${searchQuery})`, 'gi')
                    const parts = text.split(regex)
                    
                    return parts.map((part, i) => 
                      regex.test(part) ? (
                        <span key={i} className="font-semibold text-blue-600">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(brand)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{highlightMatch(brand)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <Button 
            onClick={searchAds} 
            disabled={searching || !searchQuery.trim()}
          >
            {searching ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {searchedCompany && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {ads.length > 0 
              ? `Showing ${ads.length} ads for "${searchedCompany}"`
              : `No ads found for "${searchedCompany}"`
            }
          </p>
        </div>
      )}

      {/* Ad Grid - Masonry Style */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {ads.map((ad) => {
          const formatDate = (dateString: string) => {
            try {
              const date = new Date(dateString)
              return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            } catch {
              return dateString
            }
          }

          return (
            <div 
              key={ad.id} 
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Ad Creative */}
                <div className="relative bg-gray-100">
                  {ad.creativeUrl ? (
                    <img
                      src={ad.creativeUrl}
                      alt="Ad creative"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://placehold.co/400x600/f3f4f6/9ca3af?text=${encodeURIComponent(ad.competitorName || ad.competitorId)}`
                      }}
                    />
                  ) : (
                    <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No preview available</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                </div>
                
                {/* Ad Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {ad.competitorName || ad.competitorId}
                    </span>
                    <Badge 
                      variant={ad.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {ad.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Live since {formatDate(ad.dateFound)}
                  </p>
                  {ad.text && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {ad.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Empty State */}
      {!searchedCompany && !loading && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Search for a company
          </h3>
          <p className="text-gray-500">
            Enter a company name above to see their Facebook and Instagram ads
          </p>
        </div>
      )}
    </div>
  )
}
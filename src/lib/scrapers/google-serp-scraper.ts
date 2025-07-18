import { SearchResult, CompetitorRanking, USState } from "@/types"

interface SerpResult {
  position: number
  title: string
  link: string
  displayLink: string
  snippet?: string
  isAd: boolean
  adInfo?: {
    advertiser?: string
    adCopy?: string
  }
}

interface SerpData {
  keyword: string
  location: string
  results: SerpResult[]
  totalResults?: number
  searchTime?: number
  timestamp: string
}

export class GoogleSerpScraper {
  private apiKey: string
  private searchEngineId: string

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || ""
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || ""
    
    if (!this.apiKey || !this.searchEngineId) {
      console.warn("Google API credentials not set - SERP scraping will use mock data")
    }
  }

  async searchKeyword(keyword: string, state: USState): Promise<SearchResult> {
    try {
      let serpData: SerpData

      if (this.apiKey && this.searchEngineId) {
        serpData = await this.fetchFromGoogleAPI(keyword, state)
      } else {
        serpData = this.generateMockSerpData(keyword, state)
      }

      return this.convertSerpDataToSearchResult(serpData)
    } catch (error) {
      console.error(`Failed to search keyword "${keyword}" in ${state}:`, error)
      return this.createEmptySearchResult(keyword, state)
    }
  }

  private async fetchFromGoogleAPI(keyword: string, state: USState): Promise<SerpData> {
    const url = new URL("https://www.googleapis.com/customsearch/v1")
    url.searchParams.append("key", this.apiKey)
    url.searchParams.append("cx", this.searchEngineId)
    url.searchParams.append("q", keyword)
    url.searchParams.append("gl", "us") // Country
    url.searchParams.append("cr", `country${state}`) // State-specific results
    url.searchParams.append("num", "10")

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      keyword,
      location: state,
      results: this.parseGoogleResults(data.items || []),
      totalResults: parseInt(data.searchInformation?.totalResults || "0"),
      searchTime: parseFloat(data.searchInformation?.searchTime || "0"),
      timestamp: new Date().toISOString()
    }
  }

  private parseGoogleResults(items: any[]): SerpResult[] {
    return items.map((item, index) => ({
      position: index + 1,
      title: item.title || "",
      link: item.link || "",
      displayLink: item.displayLink || "",
      snippet: item.snippet || "",
      isAd: false, // Google Custom Search API doesn't return ads
      adInfo: undefined
    }))
  }

  private generateMockSerpData(keyword: string, state: USState): SerpData {
    const mockCompetitors = [
      { name: "InsuranceCorp", domain: "insurancecorp.com" },
      { name: "QuickQuotes", domain: "quickquotes.com" },
      { name: "TrustInsure", domain: "trustinsure.com" },
      { name: "BestRates", domain: "bestrates.com" },
      { name: "SecureProtect", domain: "secureprotect.com" }
    ]

    const results: SerpResult[] = mockCompetitors.map((comp, index) => ({
      position: index + 1,
      title: `${comp.name} - ${keyword} | ${state} Insurance`,
      link: `https://${comp.domain}/${keyword.replace(/\s+/g, "-")}`,
      displayLink: comp.domain,
      snippet: `Find the best ${keyword} with ${comp.name}. Serving ${state} customers for over 10 years.`,
      isAd: index < 3, // First 3 are ads
      adInfo: index < 3 ? {
        advertiser: comp.name,
        adCopy: `Save up to 40% on ${keyword}. Get a free quote from ${comp.name} today!`
      } : undefined
    }))

    return {
      keyword,
      location: state,
      results,
      totalResults: 1250000,
      searchTime: 0.42,
      timestamp: new Date().toISOString()
    }
  }

  private convertSerpDataToSearchResult(serpData: SerpData): SearchResult {
    const rankings: CompetitorRanking[] = serpData.results
      .filter(result => result.isAd)
      .map(result => ({
        id: `ranking_${serpData.keyword}_${result.position}_${Date.now()}`,
        competitorId: result.adInfo?.advertiser || result.displayLink,
        searchResultId: "", // Will be set when saving to database
        position: result.position,
        adCopy: result.adInfo?.adCopy || result.snippet,
        url: result.link
      }))

    return {
      id: `search_${serpData.keyword}_${serpData.location}_${Date.now()}`,
      keyword: serpData.keyword,
      state: serpData.location as USState,
      date: new Date(serpData.timestamp),
      rankings
    }
  }

  private createEmptySearchResult(keyword: string, state: USState): SearchResult {
    return {
      id: `search_${keyword}_${state}_${Date.now()}`,
      keyword,
      state,
      date: new Date(),
      rankings: []
    }
  }

  async searchMultipleKeywords(keywords: string[], states: USState[]): Promise<SearchResult[]> {
    const allResults: SearchResult[] = []

    for (const state of states) {
      for (const keyword of keywords) {
        try {
          const result = await this.searchKeyword(keyword, state)
          allResults.push(result)
          
          // Rate limiting - wait between requests
          await new Promise(resolve => setTimeout(resolve, 1500))
        } catch (error) {
          console.error(`Failed to search "${keyword}" in ${state}:`, error)
          continue
        }
      }
    }

    return allResults
  }

  async getKeywordData(keywords: string[], targetStates: USState[] = [USState.CA, USState.TX, USState.FL, USState.NY, USState.IL]): Promise<SearchResult[]> {
    return await this.searchMultipleKeywords(keywords, targetStates)
  }
}

// Helper function to use in API routes
export async function getGoogleSerpData(keywords: string[], states?: USState[]): Promise<SearchResult[]> {
  const scraper = new GoogleSerpScraper()
  return await scraper.getKeywordData(keywords, states)
}
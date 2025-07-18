import { Ad, Platform, AdFormat } from "@/types"

interface MetaAdLibraryResponse {
  data: MetaAd[]
  paging?: {
    cursors?: {
      before?: string
      after?: string
    }
    next?: string
  }
}

interface MetaAd {
  id: string
  ad_creation_time: string
  ad_creative_bodies?: string[]
  ad_creative_link_captions?: string[]
  ad_creative_link_titles?: string[]
  ad_delivery_start_time: string
  ad_delivery_stop_time?: string
  ad_snapshot_url?: string
  currency?: string
  demographic_distribution?: any[]
  impressions?: {
    lower_bound?: string
    upper_bound?: string
  }
  languages?: string[]
  page_id: string
  page_name: string
  publisher_platforms?: string[]
  spend?: {
    lower_bound?: string
    upper_bound?: string
  }
}

export class MetaAdLibraryAPI {
  private accessToken: string
  private baseUrl = "https://graph.facebook.com/v18.0/ads_archive"

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || ""
    if (!this.accessToken) {
      console.warn("META_ACCESS_TOKEN not set - Meta API integration will not work")
    }
  }

  async searchAds(params: {
    searchTerms?: string
    adReachedCountries?: string[]
    adActiveStatus?: "ALL" | "ACTIVE" | "INACTIVE"
    adType?: "ALL" | "POLITICAL_AND_ISSUE_ADS" | "ALL_ADS"
    limit?: number
    after?: string
  }): Promise<MetaAdLibraryResponse> {
    if (!this.accessToken) {
      throw new Error("META_ACCESS_TOKEN not configured")
    }

    const searchParams = new URLSearchParams({
      access_token: this.accessToken,
      ad_reached_countries: params.adReachedCountries?.join(",") || "US",
      ad_active_status: params.adActiveStatus || "ALL",
      ad_type: params.adType || "ALL_ADS",
      limit: (params.limit || 50).toString(),
      fields: [
        "id",
        "ad_creation_time", 
        "ad_creative_bodies",
        "ad_creative_link_captions",
        "ad_creative_link_titles",
        "ad_delivery_start_time",
        "ad_delivery_stop_time",
        "ad_snapshot_url",
        "currency",
        "demographic_distribution",
        "impressions",
        "languages",
        "page_id",
        "page_name",
        "publisher_platforms",
        "spend"
      ].join(",")
    })

    if (params.searchTerms) {
      searchParams.append("search_terms", params.searchTerms)
    }

    if (params.after) {
      searchParams.append("after", params.after)
    }

    try {
      const response = await fetch(`${this.baseUrl}?${searchParams}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`Meta API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Meta API request failed:", error)
      throw error
    }
  }

  async getAdsByPageName(pageName: string, limit = 50): Promise<Ad[]> {
    try {
      const response = await this.searchAds({
        searchTerms: `"${pageName}"`,
        limit,
        adActiveStatus: "ALL"
      })

      return this.convertMetaAdsToAds(response.data, pageName)
    } catch (error) {
      console.error(`Failed to fetch ads for page ${pageName}:`, error)
      return []
    }
  }

  async getAdsByPageId(pageId: string, limit = 50): Promise<Ad[]> {
    if (!this.accessToken) {
      throw new Error("META_ACCESS_TOKEN not configured")
    }

    const searchParams = new URLSearchParams({
      access_token: this.accessToken,
      ad_reached_countries: "US",
      ad_active_status: "ACTIVE",
      ad_type: "ALL_ADS",
      limit: limit.toString(),
      search_page_ids: pageId,
      fields: [
        "id",
        "ad_creation_time", 
        "ad_creative_bodies",
        "ad_creative_link_captions",
        "ad_creative_link_titles",
        "ad_delivery_start_time",
        "ad_delivery_stop_time",
        "ad_snapshot_url",
        "currency",
        "demographic_distribution",
        "impressions",
        "languages",
        "page_id",
        "page_name",
        "publisher_platforms",
        "spend"
      ].join(",")
    })

    try {
      const response = await fetch(`${this.baseUrl}?${searchParams}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`Meta API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`)
      }

      const data = await response.json()
      return this.convertMetaAdsToAds(data.data, `page_${pageId}`)
    } catch (error) {
      console.error(`Failed to fetch ads for page ID ${pageId}:`, error)
      return []
    }
  }

  private convertMetaAdsToAds(metaAds: MetaAd[], competitorName: string): Ad[] {
    return metaAds.map(metaAd => {
      const adText = this.extractAdText(metaAd)
      const estimatedReach = this.extractEstimatedReach(metaAd)
      const format = this.determineAdFormat(metaAd)
      const isActive = !metaAd.ad_delivery_stop_time

      return {
        id: metaAd.id,
        competitorId: competitorName,
        platform: Platform.META,
        creativeUrl: metaAd.ad_snapshot_url,
        text: adText,
        dateFound: new Date(metaAd.ad_creation_time),
        estimatedReach,
        format,
        isActive,
        metadata: {
          pageId: metaAd.page_id,
          pageName: metaAd.page_name,
          deliveryStartTime: metaAd.ad_delivery_start_time,
          deliveryStopTime: metaAd.ad_delivery_stop_time,
          languages: metaAd.languages,
          publisherPlatforms: metaAd.publisher_platforms,
          spend: metaAd.spend,
          impressions: metaAd.impressions,
          currency: metaAd.currency
        }
      }
    })
  }

  private extractAdText(metaAd: MetaAd): string {
    const texts = [
      ...(metaAd.ad_creative_bodies || []),
      ...(metaAd.ad_creative_link_titles || []),
      ...(metaAd.ad_creative_link_captions || [])
    ]

    return texts.join(" ").trim() || "No text content available"
  }

  private extractEstimatedReach(metaAd: MetaAd): number | undefined {
    if (metaAd.impressions?.upper_bound) {
      return parseInt(metaAd.impressions.upper_bound)
    }
    if (metaAd.impressions?.lower_bound) {
      return parseInt(metaAd.impressions.lower_bound)
    }
    return undefined
  }

  private determineAdFormat(metaAd: MetaAd): AdFormat {
    // Basic format detection based on available data
    // In a real implementation, you'd analyze the creative content more thoroughly
    if (metaAd.ad_snapshot_url) {
      // Could analyze the snapshot URL to determine if it's video, image, etc.
      return AdFormat.IMAGE
    }
    return AdFormat.TEXT
  }

  async getCompetitorAds(competitorPageNames: string[], maxAdsPerCompetitor = 50): Promise<Ad[]> {
    const allAds: Ad[] = []

    for (const pageName of competitorPageNames) {
      try {
        const ads = await this.getAdsByPageName(pageName, maxAdsPerCompetitor)
        allAds.push(...ads)
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Failed to fetch ads for ${pageName}:`, error)
        continue
      }
    }

    return allAds
  }
}
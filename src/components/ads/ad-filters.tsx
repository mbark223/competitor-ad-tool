"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Platform, AdFormat, AdFilter } from "@/types"
import { Search, Filter, X } from "lucide-react"

interface AdFiltersProps {
  filters: AdFilter
  onFiltersChange: (filters: AdFilter) => void
  onClearFilters: () => void
}

export function AdFilters({ filters, onFiltersChange, onClearFilters }: AdFiltersProps) {
  const hasActiveFilters = !!(
    filters.platform ||
    filters.competitor ||
    filters.format ||
    filters.isActive !== undefined ||
    filters.dateRange
  )

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="mr-2 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search competitor name..."
            value={filters.competitor || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                competitor: e.target.value || undefined,
              })
            }
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <Select
              value={filters.platform || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  platform: value ? (value as Platform) : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All platforms</SelectItem>
                <SelectItem value={Platform.META}>Meta</SelectItem>
                <SelectItem value={Platform.TWITTER}>Twitter</SelectItem>
                <SelectItem value={Platform.SNAPCHAT}>Snapchat</SelectItem>
                <SelectItem value={Platform.GOOGLE_SEARCH}>Google Search</SelectItem>
                <SelectItem value={Platform.GOOGLE_DISPLAY}>Google Display</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Format</label>
            <Select
              value={filters.format || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  format: value ? (value as AdFormat) : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All formats</SelectItem>
                <SelectItem value={AdFormat.IMAGE}>Image</SelectItem>
                <SelectItem value={AdFormat.VIDEO}>Video</SelectItem>
                <SelectItem value={AdFormat.CAROUSEL}>Carousel</SelectItem>
                <SelectItem value={AdFormat.TEXT}>Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={
              filters.isActive === true
                ? "active"
                : filters.isActive === false
                ? "inactive"
                : ""
            }
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                isActive:
                  value === "active"
                    ? true
                    : value === "inactive"
                    ? false
                    : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
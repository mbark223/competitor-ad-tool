"use client"

import { CompanySearch } from "@/components/competitor/company-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function CompetitorsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competitor Profiles</h1>
        <p className="text-muted-foreground">
          Search for any company to view their advertising activity across all platforms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Company Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompanySearch autoFocus />
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { USState } from "@/types"

interface StateSelectorProps {
  selectedState: USState | ""
  onStateChange: (state: USState | "") => void
}

const stateNames = {
  [USState.CA]: "California",
  [USState.TX]: "Texas", 
  [USState.FL]: "Florida",
  [USState.NY]: "New York",
  [USState.IL]: "Illinois"
}

export function StateSelector({ selectedState, onStateChange }: StateSelectorProps) {
  return (
    <div className="w-48">
      <label className="text-sm font-medium mb-2 block">State</label>
      <Select
        value={selectedState}
        onValueChange={(value) => onStateChange(value as USState | "")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All states</SelectItem>
          {Object.entries(stateNames).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
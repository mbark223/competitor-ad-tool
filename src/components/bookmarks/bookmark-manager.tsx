"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bookmark, Trash2, Edit3, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BookmarkWithAd {
  id: string
  userId: string
  adId: string
  notes?: string
  createdAt: string
  ad: {
    id: string
    text: string
    platform: string
    format: string
    dateFound: string
    creativeUrl?: string
    competitor: {
      name: string
      domain: string
    }
  }
}

interface BookmarkManagerProps {
  userId?: string
}

export function BookmarkManager({ userId = "default-user" }: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkWithAd[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBookmark, setEditingBookmark] = useState<BookmarkWithAd | null>(null)
  const [editNotes, setEditNotes] = useState("")

  useEffect(() => {
    fetchBookmarks()
  }, [userId])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/bookmarks?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.bookmarks)
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${bookmarkId}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error)
    }
  }

  const updateBookmarkNotes = async (bookmarkId: string, notes: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: bookmarkId,
          notes
        })
      })
      
      if (response.ok) {
        const updatedBookmark = await response.json()
        setBookmarks(prev => 
          prev.map(b => b.id === bookmarkId ? updatedBookmark : b)
        )
        setEditingBookmark(null)
        setEditNotes("")
      }
    } catch (error) {
      console.error("Failed to update bookmark notes:", error)
    }
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Bookmark className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No bookmarked ads yet</p>
            <p className="text-sm">Bookmark ads from the Ad Explorer to save them here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={getPlatformColor(bookmark.ad.platform)}>
                  {bookmark.ad.platform}
                </Badge>
                <span className="font-medium">{bookmark.ad.competitor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingBookmark(bookmark)
                        setEditNotes(bookmark.notes || "")
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Bookmark Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Ad Preview</label>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {bookmark.ad.text}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          placeholder="Add your notes about this ad..."
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingBookmark(null)
                            setEditNotes("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => updateBookmarkNotes(bookmark.id, editNotes)}
                        >
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm mb-3 line-clamp-3">{bookmark.ad.text}</p>
            
            {bookmark.notes && (
              <div className="mb-3 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Your Notes:</p>
                <p className="text-sm text-muted-foreground">{bookmark.notes}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="space-x-4">
                <span>Format: {bookmark.ad.format}</span>
                <span>
                  Found: {formatDistanceToNow(new Date(bookmark.ad.dateFound), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>
                  Bookmarked {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
                </span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
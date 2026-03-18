"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Search, Star, Clock, Filter } from "lucide-react"
import { useOfferStore } from "@/store/useOfferStore"

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const { myOffers, fetchMyOffers, isLoading } = useOfferStore()

  useEffect(() => {
    fetchMyOffers()
  }, [fetchMyOffers])

  const filteredOffers = myOffers.filter((offer) =>
    offer.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "price_low": return a.price - b.price
      case "price_high": return b.price - a.price
      case "rating": return (b.seller?.rating ?? 0) - (a.seller?.rating ?? 0)
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Offers</h2>
        <p className="text-muted-foreground">Track offers you have sent to buyers</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </CardContent>
          </Card>
        ) : sortedOffers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No offers found</p>
              <Link href="/browse" className="mt-4">
                <Button>Browse Requests to Make Offers</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          sortedOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-6">
                {/* Request Reference */}
                <div className="mb-4 flex items-center justify-between">
                  <Link
                    href={`/request/${offer.requestId}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Request #{offer.requestId}
                  </Link>
                </div>

                {/* Seller Info */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-sm">
                        {offer.seller?.name?.slice(0, 2).toUpperCase() || "ME"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {offer.seller?.name || "You"}
                      </h3>
                      {offer.seller?.rating && (
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                            {offer.seller.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${offer.price}</p>
                    {offer.deliveryDays && (
                      <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {offer.deliveryDays} days
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">{offer.message}</p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Sent {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

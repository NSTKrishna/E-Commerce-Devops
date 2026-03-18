"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Star,
  Clock,
  MessageSquare,
  CheckCircle,
  Filter,
} from "lucide-react"

const offers = [
  {
    id: "1",
    requestId: "1",
    requestTitle: "Custom Logo Design for Tech Startup",
    seller: {
      name: "DesignPro Studio",
      avatar: "DP",
      rating: 4.9,
      reviews: 127,
      verified: true,
    },
    price: "$350",
    deliveryTime: "3 days",
    message:
      "Hi! I'd love to work on your logo. I specialize in modern, minimal designs for tech companies. Check out my portfolio for similar work.",
    status: "pending",
    sentAt: "2 hours ago",
  },
  {
    id: "2",
    requestId: "1",
    requestTitle: "Custom Logo Design for Tech Startup",
    seller: {
      name: "Creative Works",
      avatar: "CW",
      rating: 4.7,
      reviews: 89,
      verified: true,
    },
    price: "$280",
    deliveryTime: "5 days",
    message:
      "I have extensive experience with startup branding. I'll provide 3 initial concepts with unlimited revisions.",
    status: "pending",
    sentAt: "4 hours ago",
  },
  {
    id: "3",
    requestId: "2",
    requestTitle: "Home Cleaning Service - Weekly",
    seller: {
      name: "CleanHome Pro",
      avatar: "CH",
      rating: 4.8,
      reviews: 234,
      verified: true,
    },
    price: "$120/week",
    deliveryTime: "Next Monday",
    message:
      "We're a professional cleaning service with 5 years of experience. We use eco-friendly products and can start next week.",
    status: "accepted",
    sentAt: "1 day ago",
  },
  {
    id: "4",
    requestId: "3",
    requestTitle: "iPhone 15 Pro - New or Refurbished",
    seller: {
      name: "TechDeals",
      avatar: "TD",
      rating: 4.6,
      reviews: 456,
      verified: true,
    },
    price: "$899",
    deliveryTime: "2-3 days shipping",
    message:
      "Brand new iPhone 15 Pro 256GB, sealed in box. Free shipping and 1-year warranty included.",
    status: "pending",
    sentAt: "3 days ago",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="border-warning text-foreground">Pending</Badge>
    case "accepted":
      return <Badge className="bg-foreground text-background">Accepted</Badge>
    case "declined":
      return <Badge variant="destructive">Declined</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const filteredOffers = offers.filter((offer) =>
    offer.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, ""))
      case "price_high":
        return parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, ""))
      case "rating":
        return b.seller.rating - a.seller.rating
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Offers Received</h2>
        <p className="text-muted-foreground">
          Review and manage offers from sellers
        </p>
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
        {sortedOffers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No offers found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Post a request to start receiving offers
              </p>
              <Link href="/post-request" className="mt-4">
                <Button>Post a Request</Button>
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
                    Re: {offer.requestTitle}
                  </Link>
                  {getStatusBadge(offer.status)}
                </div>

                {/* Seller Info */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-sm">
                        {offer.seller.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {offer.seller.name}
                        </h3>
                        {offer.seller.verified && (
                          <CheckCircle className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                          {offer.seller.rating}
                        </span>
                        <span>{offer.seller.reviews} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {offer.price}
                    </p>
                    <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {offer.deliveryTime}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">{offer.message}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Sent {offer.sentAt}
                  </span>
                  <div className="flex gap-2">
                    {offer.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                        <Button size="sm">Accept Offer</Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

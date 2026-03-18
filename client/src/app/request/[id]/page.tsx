"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft, Clock, Tag, Star, MessageSquare, Share2,
  Calendar, DollarSign,
} from "lucide-react"
import { useRequestStore } from "@/store/useRequestStore"
import { useOfferStore } from "@/store/useOfferStore"

export default function RequestDetailPage() {
  const { id } = useParams()
  const [sortBy, setSortBy] = useState("recent")
  const { currentRequest, fetchRequestById, isLoading: reqLoading } = useRequestStore()
  const { requestOffers, fetchOffersByRequest, isLoading: offLoading } = useOfferStore()

  useEffect(() => {
    if (id) {
      fetchRequestById(id as string)
      fetchOffersByRequest(id as string)
    }
  }, [id, fetchRequestById, fetchOffersByRequest])

  const sortedOffers = [...requestOffers].sort((a, b) => {
    switch (sortBy) {
      case "price_low": return a.price - b.price
      case "price_high": return b.price - a.price
      case "rating": return (b.seller?.rating ?? 0) - (a.seller?.rating ?? 0)
      default: return 0
    }
  })

  if (reqLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentRequest) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Request not found.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Request Header */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-accent text-accent">Open</Badge>
                        <Badge variant="secondary">{currentRequest.category}</Badge>
                      </div>
                      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {currentRequest.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {new Date(currentRequest.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {requestOffers.length} offers
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentRequest.urgency}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </div>
                  </div>

                  {/* Budget & Urgency */}
                  <div className="mt-6 flex flex-wrap gap-6 rounded-lg bg-secondary/50 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {currentRequest.budgetRange || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Urgency</p>
                      <p className="mt-1 text-xl font-bold text-foreground capitalize">
                        {currentRequest.urgency}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h2 className="font-semibold text-foreground">Description</h2>
                    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {currentRequest.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offers Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Offers ({offLoading ? "..." : requestOffers.length})
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44">
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

                <div className="mt-4 space-y-4">
                  {offLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : sortedOffers.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No offers yet. Be the first to make one!</p>
                        <Link href={`/submit-offer/${id}`} className="mt-4">
                          <Button>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Send Offer
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    sortedOffers.map((offer) => (
                      <Card key={offer.id}>
                        <CardContent className="p-6">
                          {/* Seller Info */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-secondary text-sm">
                                  {offer.seller?.name?.slice(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {offer.seller?.name || "Anonymous Seller"}
                                </h3>
                                {offer.seller?.rating && (
                                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

                          {/* Actions */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-muted-foreground">
                              Sent {new Date(offer.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                              <Button size="sm">Accept Offer</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Buyer Info Card */}
              {currentRequest.buyer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Posted by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-secondary text-lg">
                          {currentRequest.buyer.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{currentRequest.buyer.name}</p>
                        <p className="text-sm text-muted-foreground">{currentRequest.buyer.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Send Offer Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Seller?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Interested in this request? Send your offer to the buyer.
                  </p>
                  <Link href={`/submit-offer/${id}`}>
                    <Button className="w-full">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Send Offer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

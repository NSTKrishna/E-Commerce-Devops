"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText, Tag, ArrowRight, Clock, Plus,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useRequestStore } from "@/store/useRequestStore"
import { useOfferStore } from "@/store/useOfferStore"

function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="border-accent text-accent">Open</Badge>
    case "in_progress":
      return <Badge variant="outline" className="border-foreground text-foreground">In Progress</Badge>
    case "closed":
      return <Badge variant="secondary">Closed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DashboardPage() {
  const { user, checkAuth } = useAuthStore()
  const { myRequests, fetchMyRequests, isLoading: reqLoading } = useRequestStore()
  const { myOffers, fetchMyOffers, isLoading: offLoading } = useOfferStore()

  useEffect(() => {
    checkAuth()
    fetchMyRequests()
    fetchMyOffers()
  }, [checkAuth, fetchMyRequests, fetchMyOffers])

  const getFirstName = () => {
    if (!user) return "there"
    return user.name.split(" ")[0] || "there"
  }

  const recentRequests = myRequests.slice(0, 3)
  const recentOffers = myOffers.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, {getFirstName()}!</h2>
          <p className="text-muted-foreground">{"Here's what's happening with your requests"}</p>
        </div>
        <Link href="/post-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Requests</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{myRequests.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offers Sent</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{myOffers.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Tag className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Requests</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {myRequests.filter(r => !r.offers || r.offers.length === 0).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Clock className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Requests</CardTitle>
            <Link href="/dashboard/requests" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {reqLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentRequests.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <p className="text-muted-foreground">No requests yet</p>
                <Link href="/post-request" className="mt-4">
                  <Button size="sm">Post your first request</Button>
                </Link>
              </div>
            ) : (
              recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/request/${request.id}`}
                  className="block rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-foreground">{request.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{request.budgetRange || "No budget set"}</span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {request.offers?.length ?? 0} offers
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(request.urgency)}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Offers</CardTitle>
            <Link href="/dashboard/offers" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {offLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentOffers.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <p className="text-muted-foreground">No offers sent yet</p>
                <Link href="/browse" className="mt-4">
                  <Button size="sm">Browse requests</Button>
                </Link>
              </div>
            ) : (
              recentOffers.map((offer) => (
                <div key={offer.id} className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Request #{offer.requestId}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-sm">
                          {offer.seller?.name?.slice(0, 2).toUpperCase() || "ME"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{offer.message.slice(0, 40)}...</p>
                        <p className="text-sm text-muted-foreground">
                          {offer.deliveryDays ? `${offer.deliveryDays} days` : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${offer.price}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

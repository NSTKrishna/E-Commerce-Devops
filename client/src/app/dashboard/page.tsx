"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText,
  Tag,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Clock,
  Plus,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const stats = [
  {
    title: "Active Requests",
    value: "4",
    change: "+2 this week",
    icon: FileText,
  },
  {
    title: "Offers Received",
    value: "12",
    change: "+5 this week",
    icon: Tag,
  },
  {
    title: "Messages",
    value: "8",
    change: "3 unread",
    icon: MessageSquare,
  },
  {
    title: "Avg. Savings",
    value: "23%",
    change: "vs market price",
    icon: TrendingUp,
  },
]

const recentRequests = [
  {
    id: "1",
    title: "Custom Logo Design for Tech Startup",
    status: "open",
    offers: 5,
    budget: "$200 - $500",
    posted: "2 hours ago",
  },
  {
    id: "2",
    title: "Home Cleaning Service - Weekly",
    status: "in_progress",
    offers: 3,
    budget: "$100 - $150",
    posted: "1 day ago",
  },
  {
    id: "3",
    title: "iPhone 15 Pro - New or Refurbished",
    status: "open",
    offers: 8,
    budget: "$800 - $1000",
    posted: "3 days ago",
  },
]

const recentOffers = [
  {
    id: "1",
    requestTitle: "Custom Logo Design for Tech Startup",
    sellerName: "DesignPro Studio",
    sellerAvatar: "DP",
    price: "$350",
    deliveryTime: "3 days",
    rating: 4.9,
  },
  {
    id: "2",
    requestTitle: "Custom Logo Design for Tech Startup",
    sellerName: "Creative Works",
    sellerAvatar: "CW",
    price: "$280",
    deliveryTime: "5 days",
    rating: 4.7,
  },
  {
    id: "3",
    requestTitle: "Home Cleaning Service - Weekly",
    sellerName: "CleanHome Pro",
    sellerAvatar: "CH",
    price: "$120/week",
    deliveryTime: "Next Monday",
    rating: 4.8,
  },
]

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
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const getFirstName = () => {
    if (!user) return "there"
    return user.user_metadata?.first_name || user.email?.split("@")[0] || "there"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, {getFirstName()}!</h2>
          <p className="text-muted-foreground">
            {"Here's what's happening with your requests"}
          </p>
        </div>
        <Link href="/post-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Requests</CardTitle>
            <Link
              href="/dashboard/requests"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`/request/${request.id}`}
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium text-foreground">
                      {request.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{request.budget}</span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {request.offers} offers
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.posted}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Offers</CardTitle>
            <Link
              href="/dashboard/offers"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOffers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs text-muted-foreground">
                  {offer.requestTitle}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-sm">
                        {offer.sellerAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {offer.sellerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {offer.rating} rating
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{offer.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {offer.deliveryTime}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

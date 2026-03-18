"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreVertical,
  Tag,
  Clock,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react"

const requests = [
  {
    id: "1",
    title: "Custom Logo Design for Tech Startup",
    description:
      "Looking for a modern, minimal logo for my tech startup. Should convey innovation and trust.",
    category: "Design & Creative",
    status: "open",
    offers: 5,
    budget: "$200 - $500",
    posted: "2 hours ago",
    views: 124,
  },
  {
    id: "2",
    title: "Home Cleaning Service - Weekly",
    description:
      "Need a reliable cleaning service for my 2-bedroom apartment, weekly basis.",
    category: "Services",
    status: "in_progress",
    offers: 3,
    budget: "$100 - $150",
    posted: "1 day ago",
    views: 89,
  },
  {
    id: "3",
    title: "iPhone 15 Pro - New or Refurbished",
    description:
      "Looking for iPhone 15 Pro, 256GB, any color. New or certified refurbished.",
    category: "Electronics",
    status: "open",
    offers: 8,
    budget: "$800 - $1000",
    posted: "3 days ago",
    views: 256,
  },
  {
    id: "4",
    title: "Website Development - E-commerce",
    description:
      "Need a full e-commerce website with payment integration, inventory management.",
    category: "Services",
    status: "closed",
    offers: 12,
    budget: "$2000 - $5000",
    posted: "1 week ago",
    views: 412,
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

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && request.status === "open") ||
      (activeTab === "in_progress" && request.status === "in_progress") ||
      (activeTab === "closed" && request.status === "closed")
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Requests</h2>
          <p className="text-muted-foreground">
            Manage and track all your posted requests
          </p>
        </div>
        <Link href="/post-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Request
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No requests found</p>
              <Link href="/post-request" className="mt-4">
                <Button>Post your first request</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/request/${request.id}`}
                          className="text-lg font-semibold text-foreground hover:underline"
                        >
                          {request.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {getStatusBadge(request.status)}
                          <Badge variant="secondary">{request.category}</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Request
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Offers
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {request.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {request.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {request.offers} offers
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {request.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {request.posted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-6 py-3">
                  <Link href={`/request/${request.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/offers?request=${request.id}`}>
                    <Button size="sm">
                      View Offers ({request.offers})
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

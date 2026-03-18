"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Tag, Clock, Eye } from "lucide-react"
import { useRequestStore } from "@/store/useRequestStore"

function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="border-accent text-accent">Open</Badge>
    case "urgent":
      return <Badge variant="outline" className="border-red-500 text-red-500">Urgent</Badge>
    case "flexible":
      return <Badge variant="secondary">Flexible</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { myRequests, fetchMyRequests, isLoading } = useRequestStore()

  useEffect(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

  const filteredRequests = myRequests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && request.urgency === "normal") ||
      (activeTab === "urgent" && request.urgency === "urgent") ||
      (activeTab === "flexible" && request.urgency === "flexible")
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Requests</h2>
          <p className="text-muted-foreground">Manage and track all your posted requests</p>
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
            <TabsTrigger value="open">Normal</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="flexible">Flexible</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </CardContent>
          </Card>
        ) : filteredRequests.length === 0 ? (
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
                          {getStatusBadge(request.urgency)}
                          <Badge variant="secondary">{request.category}</Badge>
                        </div>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {request.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {request.budgetRange || "Budget not set"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {request.offers?.length ?? 0} offers
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {request.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-6 py-3">
                  <Link href={`/request/${request.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                  <Link href={`/dashboard/offers`}>
                    <Button size="sm">View Offers ({request.offers?.length ?? 0})</Button>
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

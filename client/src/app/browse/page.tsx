"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Tag,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react"
import { useRequestStore } from "@/store/useRequestStore"

const categories = [
  "All Categories",
  "Electronics",
  "Services",
  "Fashion",
  "Home & Living",
  "Automotive",
  "Photography",
  "Design & Creative",
  "Education",
]

const urgencyValues = ["urgent", "normal", "flexible"]

function getUrgencyBadge(urgency: string) {
  switch (urgency?.toLowerCase()) {
    case "urgent":
      return <Badge variant="destructive">Urgent</Badge>
    case "flexible":
      return <Badge variant="secondary">Flexible</Badge>
    default:
      return <Badge variant="outline">Normal</Badge>
  }
}

// ── FilterSidebar extracted outside BrowsePage to avoid react-hooks/static-components ──
interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedUrgencies: string[];
  toggleUrgency: (v: string) => void;
}

function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedUrgencies,
  toggleUrgency,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Urgency</h3>
        <div className="space-y-2">
          {urgencyValues.map((urgency) => (
            <div key={urgency} className="flex items-center gap-2">
              <Checkbox
                id={urgency}
                checked={selectedUrgencies.includes(urgency)}
                onCheckedChange={() => toggleUrgency(urgency)}
              />
              <Label htmlFor={urgency} className="cursor-pointer text-sm capitalize text-muted-foreground">
                {urgency}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  const { requests, fetchRequests, isLoading } = useRequestStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedUrgencies, setSelectedUrgencies] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const toggleUrgency = (value: string) => {
    setSelectedUrgencies((prev) =>
      prev.includes(value) ? prev.filter((u) => u !== value) : [...prev, value]
    )
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...requests]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter((r) => r.category === selectedCategory)
    }

    // Urgency filter
    if (selectedUrgencies.length > 0) {
      result = result.filter((r) =>
        selectedUrgencies.includes(r.urgency?.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case "offers":
        result.sort((a, b) => (b.offers?.length ?? 0) - (a.offers?.length ?? 0))
        break
      case "budget_high":
        result.sort((a, b) => {
          const getMax = (r: typeof a) => {
            if (r.customBudgetMax) return r.customBudgetMax
            if (r.budgetRange) {
              const parts = r.budgetRange.replace(/[^0-9\s-]/g, "").split("-")
              return parseFloat(parts[parts.length - 1]?.trim() || "0")
            }
            return 0
          }
          return getMax(b) - getMax(a)
        })
        break
      case "budget_low":
        result.sort((a, b) => {
          const getMin = (r: typeof a) => {
            if (r.customBudgetMin) return r.customBudgetMin
            if (r.budgetRange) {
              const parts = r.budgetRange.replace(/[^0-9\s-]/g, "").split("-")
              return parseFloat(parts[0]?.trim() || "0")
            }
            return 0
          }
          return getMin(a) - getMin(b)
        })
        break
      default:
        // most recent — sort by createdAt descending
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return result
  }, [requests, searchQuery, selectedCategory, selectedUrgencies, sortBy])

  const sidebarProps: FilterSidebarProps = {
    selectedCategory,
    setSelectedCategory,
    selectedUrgencies,
    toggleUrgency,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Browse Requests</h1>
            <p className="mt-2 text-muted-foreground">
              Find buyer requests that match your skills and send offers
            </p>
          </div>

          {/* Search, Filters, Sort */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar {...sidebarProps} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="budget_high">Budget: High to Low</SelectItem>
                  <SelectItem value="budget_low">Budget: Low to High</SelectItem>
                  <SelectItem value="offers">Most Offers</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-lg border border-border bg-card p-4">
                <FilterSidebar {...sidebarProps} />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <p className="mb-4 text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredAndSorted.length} requests found`}
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No requests found matching your criteria</p>
                  {(searchQuery || selectedCategory !== "All Categories" || selectedUrgencies.length > 0) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("All Categories")
                        setSelectedUrgencies([])
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
                  {filteredAndSorted.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link
                          href={`/request/${request.id}`}
                          className="block p-6 transition-colors hover:bg-secondary/30"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            {getUrgencyBadge(request.urgency)}
                            <Badge variant="secondary">{request.category}</Badge>
                          </div>

                          <h3 className="mt-3 line-clamp-2 font-semibold text-foreground">
                            {request.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {request.description}
                          </p>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                              <DollarSign className="h-4 w-4" />
                              {request.budgetRange || "Budget not set"}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {request.offers?.length ?? 0} offers
                            </span>
                          </div>
                        </Link>

                        {/* Footer row */}
                        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-6 py-3">
                          <span className="text-sm text-muted-foreground">
                            {request.buyer?.name || "Anonymous"}
                          </span>
                          <Link href={`/submit-offer/${request.id}`}>
                            <Button size="sm">Send Offer</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

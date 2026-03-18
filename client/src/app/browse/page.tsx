"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Tag,
  Eye,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";

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
];

const requests = [
  {
    id: "1",
    title: "Custom Logo Design for Tech Startup",
    description:
      "Looking for a modern, minimal logo for my tech startup. Should convey innovation and trust.",
    category: "Design & Creative",
    budget: "$200 - $500",
    urgency: "Normal",
    posted: "2 hours ago",
    offers: 5,
    views: 124,
    buyer: { name: "John D.", rating: 4.8 },
  },
  {
    id: "2",
    title: "Home Cleaning Service - Weekly",
    description:
      "Need a reliable cleaning service for my 2-bedroom apartment, weekly basis.",
    category: "Services",
    budget: "$100 - $150",
    urgency: "Urgent",
    posted: "4 hours ago",
    offers: 3,
    views: 89,
    buyer: { name: "Sarah M.", rating: 4.9 },
  },
  {
    id: "3",
    title: "iPhone 15 Pro - New or Refurbished",
    description:
      "Looking for iPhone 15 Pro, 256GB, any color. New or certified refurbished.",
    category: "Electronics",
    budget: "$800 - $1000",
    urgency: "Flexible",
    posted: "1 day ago",
    offers: 8,
    views: 256,
    buyer: { name: "Mike R.", rating: 4.7 },
  },
  {
    id: "4",
    title: "Website Development - E-commerce",
    description:
      "Need a full e-commerce website with payment integration, inventory management.",
    category: "Services",
    budget: "$2000 - $5000",
    urgency: "Normal",
    posted: "2 days ago",
    offers: 12,
    views: 412,
    buyer: { name: "Emily C.", rating: 5.0 },
  },
  {
    id: "5",
    title: "Professional Photography - Product Shots",
    description:
      "Need high-quality product photos for my online store. Approximately 50 items.",
    category: "Photography",
    budget: "$500 - $800",
    urgency: "Urgent",
    posted: "5 hours ago",
    offers: 6,
    views: 178,
    buyer: { name: "Alex K.", rating: 4.6 },
  },
  {
    id: "6",
    title: "Mobile App UI/UX Design",
    description:
      "Looking for a designer to create a complete UI/UX for a fitness tracking app.",
    category: "Design & Creative",
    budget: "$1000 - $2000",
    urgency: "Normal",
    posted: "1 day ago",
    offers: 9,
    views: 345,
    buyer: { name: "Lisa T.", rating: 4.8 },
  },
];

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case "Urgent":
      return <Badge variant="destructive">Urgent</Badge>;
    case "Flexible":
      return <Badge variant="secondary">Flexible</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "budget_high":
        return (
          parseFloat(b.budget.split(" - ")[1].replace(/[^0-9]/g, "")) -
          parseFloat(a.budget.split(" - ")[1].replace(/[^0-9]/g, ""))
        );
      case "budget_low":
        return (
          parseFloat(a.budget.split(" - ")[0].replace(/[^0-9]/g, "")) -
          parseFloat(b.budget.split(" - ")[0].replace(/[^0-9]/g, ""))
        );
      case "offers":
        return b.offers - a.offers;
      default:
        return 0;
    }
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Category</h3>
        <div className="space-y-2">
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

      {/* Budget Range */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Budget Range</h3>
        <div className="space-y-2">
          {[
            { label: "Under $100", value: "under100" },
            { label: "$100 - $500", value: "100-500" },
            { label: "$500 - $1000", value: "500-1000" },
            { label: "$1000 - $5000", value: "1000-5000" },
            { label: "$5000+", value: "5000plus" },
          ].map((range) => (
            <div key={range.value} className="flex items-center gap-2">
              <Checkbox id={range.value} />
              <Label
                htmlFor={range.value}
                className="text-sm text-muted-foreground"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Urgency</h3>
        <div className="space-y-2">
          {["Urgent", "Normal", "Flexible"].map((urgency) => (
            <div key={urgency} className="flex items-center gap-2">
              <Checkbox id={urgency} />
              <Label
                htmlFor={urgency}
                className="text-sm text-muted-foreground"
              >
                {urgency}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Browse Requests
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find buyer requests that match your skills and send offers
            </p>
          </div>

          {/* Search and Filters */}
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
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="budget_high">
                    Budget: High to Low
                  </SelectItem>
                  <SelectItem value="budget_low">
                    Budget: Low to High
                  </SelectItem>
                  <SelectItem value="offers">Most Offers</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 ${
                    viewMode === "grid"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 ${
                    viewMode === "list"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                  }`}
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
                <FilterSidebar />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <p className="mb-4 text-sm text-muted-foreground">
                {sortedRequests.length} requests found
              </p>

              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2"
                    : "space-y-4"
                }
              >
                {sortedRequests.map((request) => (
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
                            {request.budget}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.posted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {request.offers} offers
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {request.views} views
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-6 py-3">
                        <span className="text-sm text-muted-foreground">
                          {request.buyer.name} ({request.buyer.rating})
                        </span>
                        <Link href={`/submit-offer/${request.id}`}>
                          <Button size="sm">Send Offer</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedRequests.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No requests found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

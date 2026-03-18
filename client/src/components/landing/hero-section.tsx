"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Users, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              The marketplace, reversed
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Post what you need.
            <br />
            <span className="text-muted-foreground">Let sellers come to you.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Stop searching endlessly. Post your request and receive competitive offers from verified sellers. Compare, negotiate, and choose the best deal.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/post-request">
              <Button size="lg" className="h-12 px-8 text-base">
                Post a Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Browse Requests
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Search className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Post Your Need</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Describe what you are looking for and set your budget range
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Receive Offers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified sellers compete to offer you the best deals
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <TrendingUp className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Choose the Best</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare offers, check ratings, and pick your winner
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

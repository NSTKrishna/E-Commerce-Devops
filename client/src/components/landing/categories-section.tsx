"use client"

import Link from "next/link"
import {
  Laptop,
  Wrench,
  Shirt,
  Home,
  Car,
  Camera,
  Palette,
  GraduationCap,
  ArrowRight,
} from "lucide-react"

const categories = [
  {
    name: "Electronics",
    description: "Phones, laptops, gadgets & more",
    icon: Laptop,
    count: "2.4K requests",
    href: "/browse?category=electronics",
  },
  {
    name: "Services",
    description: "Professional & freelance services",
    icon: Wrench,
    count: "3.1K requests",
    href: "/browse?category=services",
  },
  {
    name: "Fashion",
    description: "Clothing, accessories & footwear",
    icon: Shirt,
    count: "1.8K requests",
    href: "/browse?category=fashion",
  },
  {
    name: "Home & Living",
    description: "Furniture, decor & appliances",
    icon: Home,
    count: "2.1K requests",
    href: "/browse?category=home",
  },
  {
    name: "Automotive",
    description: "Vehicles, parts & accessories",
    icon: Car,
    count: "890 requests",
    href: "/browse?category=automotive",
  },
  {
    name: "Photography",
    description: "Cameras, equipment & services",
    icon: Camera,
    count: "650 requests",
    href: "/browse?category=photography",
  },
  {
    name: "Design & Creative",
    description: "Graphics, branding & artwork",
    icon: Palette,
    count: "1.5K requests",
    href: "/browse?category=design",
  },
  {
    name: "Education",
    description: "Courses, tutoring & materials",
    icon: GraduationCap,
    count: "980 requests",
    href: "/browse?category=education",
  },
]

export function CategoriesSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Find requests in your area of expertise or interest
            </p>
          </div>
          <Link
            href="/browse"
            className="group inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-2 text-xs font-medium text-accent">
                  {category.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

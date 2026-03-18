const stats = [
  { value: "50K+", label: "Active Buyers", description: "posting requests daily" },
  { value: "25K+", label: "Verified Sellers", description: "ready to compete" },
  { value: "98%", label: "Match Rate", description: "requests get offers" },
  { value: "$2M+", label: "Saved", description: "by our buyers monthly" },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-secondary/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { FileText, Users, MessageSquare, CheckCircle } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Post Your Request",
    description:
      "Describe what you need, set your budget, add images, and choose a category. It takes less than 2 minutes.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Receive Offers",
    description:
      "Verified sellers see your request and send competitive offers. Get notified as offers come in.",
    icon: Users,
  },
  {
    step: "03",
    title: "Compare & Chat",
    description:
      "Review seller profiles, ratings, and offers. Chat directly to negotiate and clarify details.",
    icon: MessageSquare,
  },
  {
    step: "04",
    title: "Accept & Complete",
    description:
      "Choose the best offer and complete your transaction. Leave a review to help the community.",
    icon: CheckCircle,
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get started in minutes. Our simple process connects you with the
            right sellers quickly and efficiently.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number & Icon */}
                <div className="relative z-10 mb-6 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <span className="text-xs font-bold text-muted-foreground">
                    {item.step}
                  </span>
                  <item.icon className="mt-1 h-8 w-8 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

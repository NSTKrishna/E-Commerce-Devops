"use client"

import Link from "next/link"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, DollarSign, Clock, CheckCircle } from "lucide-react"

const request = {
  id: "1",
  title: "Custom Logo Design for Tech Startup",
  description:
    "Looking for a modern, minimal logo for my tech startup. Should convey innovation and trust.",
  category: "Design & Creative",
  budget: "$200 - $500",
  urgency: "Normal",
  buyer: { name: "John D.", rating: 4.8 },
}

export default function SubmitOfferPage() {
  const [formData, setFormData] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-secondary/30 p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Offer Sent Successfully!
              </h2>
              <p className="mt-2 text-muted-foreground">
                The buyer will be notified about your offer. You will receive a
                notification when they respond.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/seller/offers">
                  <Button variant="outline">View My Offers</Button>
                </Link>
                <Link href="/browse">
                  <Button>Browse More Requests</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back Link */}
          <Link
            href={`/request/${request.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Request
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Your Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Your Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="Enter your price"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="h-11 pl-9"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {"Buyer's budget: "}{request.budget}
                      </p>
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Select
                        value={formData.deliveryTime}
                        onValueChange={(value) =>
                          setFormData({ ...formData, deliveryTime: value })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1day">1 Day</SelectItem>
                          <SelectItem value="2-3days">2-3 Days</SelectItem>
                          <SelectItem value="1week">1 Week</SelectItem>
                          <SelectItem value="2weeks">2 Weeks</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Introduce yourself and explain why you're the best fit for this request. Highlight your relevant experience and what makes your offer stand out..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="min-h-40 resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>

                    {/* Tips */}
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h4 className="font-medium text-foreground">
                        Tips for a Great Offer
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>- Be specific about what you will deliver</li>
                        <li>- Mention relevant experience or portfolio pieces</li>
                        <li>- Set a competitive but fair price</li>
                        <li>- Be realistic about delivery time</li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="sticky bottom-0 border-t border-border bg-card pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={
                          isSubmitting ||
                          !formData.price ||
                          !formData.deliveryTime ||
                          !formData.message
                        }
                      >
                        {isSubmitting ? "Sending Offer..." : "Send Offer"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Request Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Request Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="secondary">{request.category}</Badge>
                    <h3 className="mt-2 font-semibold text-foreground">
                      {request.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <span className="font-semibold text-foreground">
                        {request.budget}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Urgency</span>
                      <span className="font-semibold text-foreground">
                        {request.urgency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Buyer</span>
                    <span className="text-sm font-medium text-foreground">
                      {request.buyer.name} ({request.buyer.rating})
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

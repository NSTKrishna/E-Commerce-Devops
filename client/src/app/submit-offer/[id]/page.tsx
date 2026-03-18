"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, DollarSign, Clock, CheckCircle } from "lucide-react"
import { useOfferStore } from "@/store/useOfferStore"
import { useRequestStore } from "@/store/useRequestStore"

export default function SubmitOfferPage() {
  const { id } = useParams()
  const router = useRouter()
  const { createOffer, isLoading, error } = useOfferStore()
  const { currentRequest, fetchRequestById } = useRequestStore()
  const [formData, setFormData] = useState({ price: "", deliveryDays: "", message: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (id) fetchRequestById(id as string)
  }, [id, fetchRequestById])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await createOffer({
        requestId: Number(id),
        price: Number(formData.price),
        message: formData.message,
        deliveryDays: formData.deliveryDays ? Number(formData.deliveryDays) : undefined,
      })
      setIsSubmitted(true)
    } catch {
      // error shown via store
    }
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
              <h2 className="text-2xl font-bold text-foreground">Offer Sent Successfully!</h2>
              <p className="mt-2 text-muted-foreground">
                The buyer will be notified. You will receive a notification when they respond.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard/offers">
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
            href={`/request/${id}`}
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
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="h-11 pl-9"
                          required
                        />
                      </div>
                      {currentRequest?.budgetRange && (
                        <p className="text-xs text-muted-foreground">
                          {"Buyer's budget: "}{currentRequest.budgetRange}
                        </p>
                      )}
                    </div>

                    {/* Delivery Days */}
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDays">Delivery Time (days)</Label>
                      <Select
                        value={formData.deliveryDays}
                        onValueChange={(value) => setFormData({ ...formData, deliveryDays: value })}
                      >
                        <SelectTrigger className="h-11">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="3">2-3 Days</SelectItem>
                          <SelectItem value="7">1 Week</SelectItem>
                          <SelectItem value="14">2 Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Introduce yourself and explain why you're the best fit..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-40 resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground">{formData.message.length}/1000 characters</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    {/* Tips */}
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h4 className="font-medium text-foreground">Tips for a Great Offer</h4>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>- Be specific about what you will deliver</li>
                        <li>- Mention relevant experience or portfolio pieces</li>
                        <li>- Set a competitive but fair price</li>
                        <li>- Be realistic about delivery time</li>
                      </ul>
                    </div>

                    {/* Submit */}
                    <div className="sticky bottom-0 border-t border-border bg-card pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || !formData.price || !formData.deliveryDays || !formData.message}
                      >
                        {isLoading ? "Sending Offer..." : "Send Offer"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Request Summary */}
            {currentRequest && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Request Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="secondary">{currentRequest.category}</Badge>
                      <h3 className="mt-2 font-semibold text-foreground">{currentRequest.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{currentRequest.description}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Budget</span>
                        <span className="font-semibold text-foreground">{currentRequest.budgetRange || "N/A"}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Urgency</span>
                        <span className="font-semibold capitalize text-foreground">{currentRequest.urgency}</span>
                      </div>
                    </div>
                    {currentRequest.buyer && (
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm text-muted-foreground">Buyer</span>
                        <span className="text-sm font-medium text-foreground">{currentRequest.buyer.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

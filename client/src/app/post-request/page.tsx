"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft, ArrowRight, CheckCircle,
  Laptop, Wrench, Shirt, Home, Car, Camera, Palette, GraduationCap,
} from "lucide-react"
import { useRequestStore } from "@/store/useRequestStore"

const categories = [
  { id: "Electronics", name: "Electronics", icon: Laptop },
  { id: "Services", name: "Services", icon: Wrench },
  { id: "Fashion", name: "Fashion", icon: Shirt },
  { id: "Home & Living", name: "Home & Living", icon: Home },
  { id: "Automotive", name: "Automotive", icon: Car },
  { id: "Photography", name: "Photography", icon: Camera },
  { id: "Design & Creative", name: "Design & Creative", icon: Palette },
  { id: "Education", name: "Education", icon: GraduationCap },
]

const budgetRanges = [
  { id: "Under $100", label: "Under $100" },
  { id: "$100 - $500", label: "$100 - $500" },
  { id: "$500 - $1,000", label: "$500 - $1,000" },
  { id: "$1,000 - $5,000", label: "$1,000 - $5,000" },
  { id: "$5,000+", label: "$5,000+" },
  { id: "custom", label: "Custom Range" },
]

const steps = [
  { id: 1, name: "Category" },
  { id: 2, name: "Details" },
  { id: 3, name: "Budget" },
  { id: 4, name: "Review" },
]

export default function PostRequestPage() {
  const router = useRouter()
  const { createRequest, isLoading, error } = useRequestStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    budget: "",
    customBudgetMin: "",
    customBudgetMax: "",
    urgency: "normal",
    images: [] as string[],
  })

  const handleNext = () => { if (currentStep < 4) setCurrentStep(currentStep + 1) }
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  const handleSubmit = async () => {
    try {
      await createRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budgetRange: formData.budget === "custom"
          ? `$${formData.customBudgetMin} - $${formData.customBudgetMax}`
          : formData.budget,
        customBudgetMin: formData.budget === "custom" ? Number(formData.customBudgetMin) : undefined,
        customBudgetMax: formData.budget === "custom" ? Number(formData.customBudgetMax) : undefined,
        urgency: formData.urgency,
      })
      router.push("/dashboard/requests")
    } catch {
      // error shown via store
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.category !== ""
      case 2: return formData.title.length >= 10 && formData.description.length >= 20
      case 3: return formData.budget !== ""
      case 4: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">Post a Request</h1>
          <p className="mt-2 text-muted-foreground">Describe what you need and let sellers come to you</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`mt-2 hidden text-xs sm:block ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 w-12 sm:w-20 lg:w-32 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Select a Category</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the category that best fits your request</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.id })}
                      className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                        formData.category === category.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        formData.category === category.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Request Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Provide details about what you are looking for</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Custom Logo Design for Tech Startup"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">{formData.title.length}/100 characters (min 10)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you need in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-32 resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.description.length}/2000 characters (min 20)</p>
                  </div>
                  <div className="space-y-3">
                    <Label>Urgency</Label>
                    <RadioGroup
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      className="flex flex-wrap gap-3"
                    >
                      {[
                        { value: "normal", label: "Normal" },
                        { value: "urgent", label: "Urgent (24-48h)" },
                        { value: "flexible", label: "Flexible" },
                      ].map((option) => (
                        <Label
                          key={option.value}
                          htmlFor={option.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${
                            formData.urgency === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Set Your Budget</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Help sellers understand your price range</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: range.id })}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${
                        formData.budget === range.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <span className="font-medium text-foreground">{range.label}</span>
                    </button>
                  ))}
                </div>
                {formData.budget === "custom" && (
                  <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="minBudget">Minimum</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="minBudget"
                          type="number"
                          placeholder="0"
                          value={formData.customBudgetMin}
                          onChange={(e) => setFormData({ ...formData, customBudgetMin: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <span className="mt-6 text-muted-foreground">to</span>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="maxBudget">Maximum</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="maxBudget"
                          type="number"
                          placeholder="0"
                          value={formData.customBudgetMax}
                          onChange={(e) => setFormData({ ...formData, customBudgetMax: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Review Your Request</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Make sure everything looks good before posting</p>
                </div>
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="font-medium text-foreground">{formData.category}</span>
                  </div>
                  <div className="border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <p className="mt-1 font-medium text-foreground">{formData.title}</p>
                  </div>
                  <div className="border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="mt-1 text-sm text-foreground">{formData.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="font-medium text-foreground">
                      {formData.budget === "custom"
                        ? `$${formData.customBudgetMin} - $${formData.customBudgetMax}`
                        : formData.budget}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Urgency</span>
                    <span className="font-medium capitalize text-foreground">{formData.urgency}</span>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading || !canProceed()}>
                  {isLoading ? "Posting..." : "Post Request"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

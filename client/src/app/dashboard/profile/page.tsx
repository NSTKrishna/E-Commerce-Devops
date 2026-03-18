"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  FileText,
  Tag,
  CheckCircle,
  Edit,
  Save,
} from "lucide-react"

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  memberSince: "January 2025",
  avatar: "JD",
  bio: "Tech entrepreneur looking for quality services and products. I value professionalism, clear communication, and timely delivery.",
  stats: {
    requestsPosted: 12,
    offersReceived: 45,
    dealsCompleted: 8,
    rating: 4.8,
    reviews: 23,
  },
}

const recentActivity = [
  {
    type: "request",
    title: "Custom Logo Design for Tech Startup",
    date: "2 hours ago",
    status: "5 offers received",
  },
  {
    type: "accepted",
    title: "Home Cleaning Service - Weekly",
    date: "1 day ago",
    status: "Deal in progress",
  },
  {
    type: "completed",
    title: "Website Development - E-commerce",
    date: "1 week ago",
    status: "Completed",
  },
  {
    type: "review",
    title: "Left review for Creative Works",
    date: "2 weeks ago",
    status: "5 stars",
  },
]

const reviews = [
  {
    id: "1",
    from: "DesignPro Studio",
    rating: 5,
    comment:
      "Great buyer! Clear communication and prompt payment. Would love to work together again.",
    date: "1 week ago",
    request: "Website Redesign",
  },
  {
    id: "2",
    from: "CleanHome Pro",
    rating: 5,
    comment:
      "Very professional. Provided detailed requirements and was easy to work with.",
    date: "2 weeks ago",
    request: "Office Cleaning",
  },
  {
    id: "3",
    from: "TechDeals",
    rating: 4,
    comment: "Good buyer, smooth transaction. Recommended!",
    date: "1 month ago",
    request: "MacBook Pro Purchase",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
  })

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-secondary text-2xl">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.name}
                    </h2>
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member since {user.memberSince}
                    </span>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <p className="mt-4 text-muted-foreground">{user.bio}</p>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats.requestsPosted}
                  </p>
                  <p className="text-xs text-muted-foreground">Requests</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats.offersReceived}
                  </p>
                  <p className="text-xs text-muted-foreground">Offers</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats.dealsCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                    <Star className="h-5 w-5 fill-foreground" />
                    {user.stats.rating}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats.reviews}
                  </p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      activity.type === "completed"
                        ? "bg-foreground text-background"
                        : activity.type === "accepted"
                        ? "bg-secondary"
                        : "bg-secondary"
                    }`}
                  >
                    {activity.type === "request" && <FileText className="h-5 w-5" />}
                    {activity.type === "accepted" && <Tag className="h-5 w-5" />}
                    {activity.type === "completed" && (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    {activity.type === "review" && <Star className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground">{activity.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{activity.date}</span>
                      <span>-</span>
                      <Badge variant="secondary">{activity.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reviews from Sellers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-sm">
                          {review.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{review.from}</p>
                        <p className="text-xs text-muted-foreground">
                          Re: {review.request}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-foreground text-foreground"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {`"${review.comment}"`}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="min-h-24"
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Email notifications", description: "Receive email updates" },
                  { label: "New offer alerts", description: "Get notified when you receive offers" },
                  { label: "Message notifications", description: "Get notified of new messages" },
                  { label: "Marketing emails", description: "Receive tips and promotions" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={index < 3} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

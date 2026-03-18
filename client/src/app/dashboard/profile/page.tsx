"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Mail, Star, FileText, Tag, Edit, Save } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useRequestStore } from "@/store/useRequestStore"
import { useOfferStore } from "@/store/useOfferStore"

export default function ProfilePage() {
  const { user, checkAuth, updateProfile } = useAuthStore()
  const { myRequests, fetchMyRequests } = useRequestStore()
  const { myOffers, fetchMyOffers } = useOfferStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "" })

  useEffect(() => {
    checkAuth()
    fetchMyRequests()
    fetchMyOffers()
  }, [checkAuth, fetchMyRequests, fetchMyOffers])

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email })
    }
  }, [user])

  const getUserInitials = () => {
    if (!user) return "?"
    const names = user.name.split(" ")
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
    return user.name[0]?.toUpperCase() || "?"
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      await updateProfile({ name: formData.name })
      setIsEditing(false)
    } catch {
      setSaveError("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-secondary text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user?.name || "Loading..."}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </span>
                    <span className="capitalize text-xs bg-secondary px-2 py-1 rounded">
                      {user?.role?.toLowerCase() || "user"}
                    </span>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <><Save className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : "Save Changes"}</>
                  ) : (
                    <><Edit className="mr-2 h-4 w-4" />Edit Profile</>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold text-foreground">{myRequests.length}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Requests</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold text-foreground">{myOffers.length}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Offers</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    <p className="text-2xl font-bold text-foreground">-</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-64">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user?.role || ""} disabled className="opacity-60 capitalize" />
              </div>
              {saveError && <p className="text-sm text-destructive">{saveError}</p>}
              {isEditing && (
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
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
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={index < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

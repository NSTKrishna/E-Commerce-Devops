"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
  Clock,
} from "lucide-react"

const conversations = [
  {
    id: "1",
    user: {
      name: "DesignPro Studio",
      avatar: "DP",
      online: true,
    },
    lastMessage: "I'll send you the initial concepts tomorrow morning",
    timestamp: "2 min ago",
    unread: 2,
    request: "Custom Logo Design for Tech Startup",
    offerPrice: "$350",
  },
  {
    id: "2",
    user: {
      name: "CleanHome Pro",
      avatar: "CH",
      online: true,
    },
    lastMessage: "Great! We'll start next Monday as discussed",
    timestamp: "1 hour ago",
    unread: 0,
    request: "Home Cleaning Service - Weekly",
    offerPrice: "$120/week",
  },
  {
    id: "3",
    user: {
      name: "TechDeals",
      avatar: "TD",
      online: false,
    },
    lastMessage: "The iPhone is in stock. Free shipping included!",
    timestamp: "3 hours ago",
    unread: 0,
    request: "iPhone 15 Pro - New or Refurbished",
    offerPrice: "$899",
  },
  {
    id: "4",
    user: {
      name: "Creative Works",
      avatar: "CW",
      online: false,
    },
    lastMessage: "Thank you for considering my offer!",
    timestamp: "1 day ago",
    unread: 0,
    request: "Custom Logo Design for Tech Startup",
    offerPrice: "$280",
  },
]

const messages = [
  {
    id: "1",
    senderId: "seller",
    content:
      "Hi John! Thank you for your interest in my design services. I'd love to work on your NeuraTech logo project.",
    timestamp: "10:30 AM",
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    content:
      "Hi! Thanks for your offer. Your portfolio looks great. Can you tell me more about your process?",
    timestamp: "10:35 AM",
    status: "read",
  },
  {
    id: "3",
    senderId: "seller",
    content:
      "Of course! My process involves:\n\n1. Discovery call to understand your brand\n2. Research and mood board creation\n3. 3-4 initial concept sketches\n4. Digital refinement of chosen direction\n5. Final delivery with all formats\n\nI typically deliver the first concepts within 3-4 days.",
    timestamp: "10:42 AM",
    status: "read",
  },
  {
    id: "4",
    senderId: "me",
    content:
      "That sounds thorough! How many revisions are included in your price?",
    timestamp: "10:45 AM",
    status: "read",
  },
  {
    id: "5",
    senderId: "seller",
    content:
      "I include unlimited revisions until you're completely satisfied. Most projects are finalized within 2-3 rounds of feedback.",
    timestamp: "10:48 AM",
    status: "read",
  },
  {
    id: "6",
    senderId: "me",
    content: "That's great! When can you start?",
    timestamp: "11:00 AM",
    status: "read",
  },
  {
    id: "7",
    senderId: "seller",
    content:
      "I can start immediately! I have availability this week. Once you accept the offer, we can schedule a quick discovery call to kick things off.",
    timestamp: "11:05 AM",
    status: "read",
  },
  {
    id: "8",
    senderId: "seller",
    content: "I'll send you the initial concepts tomorrow morning",
    timestamp: "11:10 AM",
    status: "delivered",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  )
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.request.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    // Handle message send
    setNewMessage("")
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border bg-card">
      {/* Conversations List */}
      <div className="flex w-80 flex-col border-r border-border">
        {/* Search */}
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  selectedConversation.id === conversation.id
                    ? "bg-secondary"
                    : "hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-sm">
                        {conversation.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {conversation.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.lastMessage}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Re: {conversation.request}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted">
                {selectedConversation.user.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {selectedConversation.user.name}
                </h3>
                {selectedConversation.user.online && (
                  <span className="text-xs text-accent">Online</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Re: {selectedConversation.request}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Offer Banner */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Offer:</span>
            <span className="font-semibold text-foreground">
              {selectedConversation.offerPrice}
            </span>
            <Badge variant="outline" className="border-warning text-foreground">
              Pending
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Decline
            </Button>
            <Button size="sm">Accept Offer</Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 ${
                    message.senderId === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                      message.senderId === "me"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    {message.senderId === "me" && (
                      <>
                        {message.status === "read" ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth, db } from "@/lib/localDb"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"
import { 
  Plus, 
  PackageOpen, 
  MapPin, 
  Calendar, 
  MoreVertical,
  Trash2,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/localDb"
import type { FoundItem } from "@/components/item-card"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const router = useRouter()
  
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string; student_id: string } | null>(null)
  const [items, setItems] = useState<FoundItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/dashboard")
        return
      }
      setUser(user)
      fetchData(user.id)
    }

    checkAuth()
  }, [router])

  const fetchData = async (userId: string) => {
    setLoading(true)
    
    // Fetch profile
    const profileData = db.getProfile(userId)
    if (profileData) {
      setProfile(profileData)
    }

    // Fetch user's reported items
    const itemsData = db.getItems({ finder_id: userId })
    setItems(itemsData as FoundItem[])

    setLoading(false)
  }

  const updateItemStatus = async (itemId: string, newStatus: string) => {
    setUpdating(itemId)
    const { error } = db.updateItem(itemId, { status: newStatus as FoundItem["status"], updated_at: new Date().toISOString() })
    if (!error) {
      setItems(items.map(item =>
        item.id === itemId ? { ...item, status: newStatus as FoundItem["status"] } : item
      ))
    }
    setUpdating(null)
  }

  const deleteItem = async (itemId: string) => {
    const { error } = db.deleteItem(itemId)
    if (!error) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }

  const statusColors = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    claimed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    returned: "bg-muted text-muted-foreground",
  }

  const stats = {
    total: items.length,
    available: items.filter(i => i.status === "available").length,
    claimed: items.filter(i => i.status === "claimed").length,
    returned: items.filter(i => i.status === "returned").length,
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="w-8 h-8" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 md:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email?.split("@")[0]}
              </p>
            </div>
            <Button asChild>
              <Link href="/report">
                <Plus className="w-4 h-4 mr-2" />
                Report New Item
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.claimed}</p>
                <p className="text-sm text-muted-foreground">Claimed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-muted-foreground">{stats.returned}</p>
                <p className="text-sm text-muted-foreground">Returned</p>
              </CardContent>
            </Card>
          </div>

          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Reported Items</CardTitle>
              <CardDescription>
                Manage the items you've reported finding on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <Empty
                  icon={PackageOpen}
                  title="No items reported yet"
                  description="Start helping the campus community by reporting items you've found."
                  action={
                    <Button asChild>
                      <Link href="/report">
                        <Plus className="w-4 h-4 mr-2" />
                        Report Your First Item
                      </Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card"
                    >
                      {/* Image */}
                      <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <PackageOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {item.title}
                              </h3>
                              <Badge className={statusColors[item.status]} variant="secondary">
                                {item.status}
                              </Badge>
                            </div>
                            {item.category && (
                              <p className="text-xs text-primary mb-2">{item.category.name}</p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/items/${item.id}`} className="flex items-center">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete 
                                      this item report from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteItem(item.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location_found}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(item.date_found), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <span className="text-xs text-muted-foreground sm:hidden">Status:</span>
                        <Select
                          value={item.status}
                          onValueChange={(value) => updateItemStatus(item.id, value)}
                          disabled={updating === item.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            {updating === item.id ? (
                              <Spinner className="w-4 h-4" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="claimed">Claimed</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

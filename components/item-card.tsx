"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/localDb"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface FoundItem {
  id: string
  title: string
  description: string
  category_id: string | null
  location_found: string
  date_found: string
  image_url: string | null
  status: "available" | "claimed" | "returned"
  finder_id: string
  // optional id of the user who has claimed the item
  claimer_id?: string | null
  created_at: string
  category?: {
    id: string
    name: string
    icon: string | null
  } | null
  finder?: {
    full_name: string
  } | null
  // optionally include profile info of the claimer when available
  claimer?: {
    full_name: string
  } | null
}

interface ItemCardProps {
  item: FoundItem
}

export function ItemCard({ item }: ItemCardProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [claiming, setClaiming] = useState(false)
  const [localItem, setLocalItem] = useState(item)

  useEffect(() => {
    setLocalItem(item)
  }, [item])

  useEffect(() => {
    auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleClaim = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      router.push(`/auth/login?redirect=/items/${item.id}`)
      return
    }
    if (user.id === item.finder_id) return
    setClaiming(true)
    const { error } = await db.claimItem(item.id, user.id)
    if (!error) {
      const updated = db.getItemById(item.id)
      if (updated) {
        setLocalItem({ ...updated })
      }
      router.refresh()
    }
    setClaiming(false)
  }

  const statusColors = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    claimed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    returned: "bg-muted text-muted-foreground",
  }

  const statusLabels = {
    available: "Available",
    claimed: "Claimed",
    returned: "Returned",
  }

  const displayItem = localItem

  return (
    <Link href={`/items/${displayItem.id}`}> 
      <Card className="group overflow-hidden hover:border-primary/50 hover:shadow-md transition-all h-full">
        <div className="aspect-[4/3] relative bg-muted overflow-hidden">
          {displayItem.image_url ? (
            <Image
              src={displayItem.image_url}
              alt={displayItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <Badge 
            className={`absolute top-3 right-3 ${statusColors[displayItem.status]}`}
            variant="secondary"
          >
            {statusLabels[displayItem.status]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            {displayItem.category && (
              <span className="text-xs font-medium text-primary">{displayItem.category.name}</span>
            )}
          </div>
          <h3 className="font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {displayItem.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {displayItem.description}
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{displayItem.location_found}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>Found {formatDistanceToNow(new Date(displayItem.date_found), { addSuffix: true })}</span>
          </div>
          {user && displayItem.status === "available" && user.id !== item.finder_id && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClaim}
              disabled={claiming}
              className="mt-2 w-full"
            >
              {claiming ? "Claiming..." : "Claim"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
  created_at: string
  category?: {
    id: string
    name: string
    icon: string | null
  } | null
  finder?: {
    full_name: string
  } | null
}

interface ItemCardProps {
  item: FoundItem
}

export function ItemCard({ item }: ItemCardProps) {
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

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="group overflow-hidden hover:border-primary/50 hover:shadow-md transition-all h-full">
        <div className="aspect-[4/3] relative bg-muted overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
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
            className={`absolute top-3 right-3 ${statusColors[item.status]}`}
            variant="secondary"
          >
            {statusLabels[item.status]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            {item.category && (
              <span className="text-xs font-medium text-primary">{item.category.name}</span>
            )}
          </div>
          <h3 className="font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{item.location_found}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>Found {formatDistanceToNow(new Date(item.date_found), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

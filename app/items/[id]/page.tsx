import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Calendar, User, Mail, Phone, Clock } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface ItemDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from("found_items")
    .select(`
      *,
      category:categories(id, name, icon),
      finder:profiles(id, full_name, email, phone, student_id)
    `)
    .eq("id", id)
    .single()

  if (error || !item) {
    notFound()
  }

  const statusColors = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    claimed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    returned: "bg-muted text-muted-foreground",
  }

  const statusLabels = {
    available: "Available for Pickup",
    claimed: "Claimed - Pending Pickup",
    returned: "Returned to Owner",
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/items">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all items
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <svg
                      className="w-24 h-24"
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
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {item.category && (
                    <span className="text-sm font-medium text-primary">{item.category.name}</span>
                  )}
                  <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                    {statusLabels[item.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{item.title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location Found</p>
                    <p className="font-medium">{item.location_found}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Found</p>
                    <p className="font-medium">
                      {format(new Date(item.date_found), "MMMM d, yyyy")}
                      <span className="text-muted-foreground font-normal">
                        {" "}({formatDistanceToNow(new Date(item.date_found), { addSuffix: true })})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Finder Contact Card */}
              {item.finder && item.status === "available" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact the Finder</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.finder.full_name}</p>
                        <p className="text-sm text-muted-foreground">{item.finder.student_id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href={`mailto:${item.finder.email}?subject=Regarding Found Item: ${item.title}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {item.finder.email}
                      </a>
                      {item.finder.phone && (
                        <a
                          href={`tel:${item.finder.phone}`}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          {item.finder.phone}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {item.status !== "available" && (
                <Card className="bg-muted/50">
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">
                      {item.status === "claimed" 
                        ? "This item has been claimed and is pending pickup."
                        : "This item has been returned to its owner."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

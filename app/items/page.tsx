import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { ItemCard, type FoundItem } from "@/components/item-card"
import { Empty } from "@/components/ui/empty"
import { PackageOpen } from "lucide-react"

interface ItemsPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    status?: string
    sort?: string
  }>
}

async function ItemsGrid({ searchParams }: { searchParams: ItemsPageProps["searchParams"] }) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("found_items")
    .select(`
      *,
      category:categories(id, name, icon),
      finder:profiles(full_name)
    `)

  // Apply search filter
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  // Apply category filter
  if (params.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", params.category)
      .single()
    
    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  // Apply status filter
  if (params.status) {
    query = query.eq("status", params.status)
  }

  // Apply sorting
  const sortOrder = params.sort === "oldest" ? { ascending: true } : { ascending: false }
  query = query.order("created_at", sortOrder)

  const { data: items, error } = await query

  if (error) {
    console.error("Error fetching items:", error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load items. Please try again.</p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <Empty
        icon={PackageOpen}
        title="No items found"
        description={params.search || params.category || params.status 
          ? "Try adjusting your search or filters to find what you're looking for."
          : "No items have been reported yet. Be the first to report a found item!"
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item as FoundItem} />
      ))}
    </div>
  )
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Browse Found Items</h1>
            <p className="text-muted-foreground">
              Search through items that have been found on campus. Use the filters to narrow down your search.
            </p>
          </div>

          <div className="mb-8">
            <SearchFilters categories={categories || []} />
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <ItemsGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { ItemCard, type FoundItem } from "@/components/item-card"
import { Empty } from "@/components/ui/empty"
import { PackageOpen } from "lucide-react"

interface ItemsPageProps {
  searchParams: {
    search?: string
    category?: string
    status?: string
    sort?: string
  }
}

function ItemsGrid({ searchParams }: { searchParams: ItemsPageProps["searchParams"] }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchItems() {
      setLoading(true)
      let query = supabase
        .from('found_items')
        .select(`
          *,
          category:categories(id, name),
          finder:profiles!finder_id(id, full_name, email, phone, student_id)
        `)

      // Apply status filter - default to available
      const statusFilter = searchParams.status === undefined ? "available" : searchParams.status
      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      // Apply search filter
      if (searchParams.search) {
        query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
      }

      // Apply category filter
      if (searchParams.category) {
        const { data: categories } = await supabase.from('categories').select('id, name')
        const cat = categories?.find((c) => c.name === searchParams.category)
        if (cat) {
          query = query.eq('category_id', cat.id)
        }
      }

      // Apply sorting
      if (searchParams.sort === 'oldest') {
        query = query.order('created_at', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (!error && data) {
        setItems(data)
      }
      setLoading(false)
    }

    fetchItems()
  }, [searchParams.search, searchParams.category, searchParams.status, searchParams.sort])

  if (loading) {
    return (
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
    )
  }

  if (!items || items.length === 0) {
    return (
      <Empty
        icon={PackageOpen}
        title="No items found"
        description={searchParams.search || searchParams.category || searchParams.status 
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

export default function ItemsPage({ searchParams }: ItemsPageProps) {
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  // derive current filter values from the server-supplied searchParams
  const currentSearch = searchParams.search || ""
  const currentCategory = searchParams.category || ""
  // if user hasn't specified a status, default to only available items so
  // new visitors automatically see things they can claim
  // if the status query param is completely absent use "available" by default
  // but if it's an empty string we allow showing all statuses (user chose "all").
  const currentStatus = searchParams.status === undefined ? "available" : searchParams.status || ""
  const currentSort = searchParams.sort || "newest"

  const router = useRouter()
  const updateFilters = (params: { search?: string; category?: string; status?: string; sort?: string }) => {
    const newParams = {
      search: params.search !== undefined ? params.search : currentSearch,
      category: params.category !== undefined ? params.category : currentCategory,
      status: params.status !== undefined ? params.status : currentStatus,
      sort: params.sort !== undefined ? params.sort : currentSort,
    }
    const qs = new URLSearchParams()
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) qs.set(k, v)
    })
    router.push(`/items?${qs.toString()}`)
  }

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
            <SearchFilters
              categories={categories || []}
              currentSearch={currentSearch}
              currentCategory={currentCategory}
              currentStatus={currentStatus}
              currentSort={currentSort}
              onChange={updateFilters}
            />
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

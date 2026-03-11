"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/localDb"
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
  const params = searchParams

  // compute filters
  let categoryId: string | undefined
  if (params.category) {
    const cats = db.getCategories()
    const cat = cats.find((c) => c.name === params.category)
    if (cat) categoryId = cat.id
  }

  const items = db.getItems({
    search: params.search,
    category_id: categoryId || undefined,
    status: params.status as any,
    sort: params.sort,
  })

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

export default function ItemsPage({ searchParams }: ItemsPageProps) {
  const categories = db.getCategories()

  // derive current filter values from the server-supplied searchParams
  const currentSearch = searchParams.search || ""
  const currentCategory = searchParams.category || ""
  const currentStatus = searchParams.status || ""
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

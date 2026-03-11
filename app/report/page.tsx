"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth, db } from "@/lib/localDb"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import type { User } from "@/lib/localDb"

interface Category {
  id: string
  name: string
}

export default function ReportItemPage() {
  const router = useRouter()
  // const supabase = createClient() // using localDb instead
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    locationFound: "",
    dateFound: new Date().toISOString().split("T")[0],
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/report")
        return
      }
      setUser(user)
      setLoading(false)
    }

    const fetchCategories = async () => {
      const data = db.getCategories()
      setCategories(data)
    }

    checkAuth()
    fetchCategories()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError(null)
    setSubmitting(true)

    try {
      let imageUrl: string | null = null

      // Upload image if provided
      if (imageFile) {
        const { publicUrl } = await db.uploadImage("item-images", imageFile)
        imageUrl = publicUrl
      }

      // Insert the found item
      const { error: insertError } = db.insertItem({
        id: Math.random().toString(36).substring(2),
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId || null,
        location_found: formData.locationFound,
        date_found: formData.dateFound,
        image_url: imageUrl,
        finder_id: user.id,
        status: "available",
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        throw new Error("Failed to submit report: " + insertError.message)
      }

      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
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

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Item Reported Successfully!</CardTitle>
              <CardDescription>
                Thank you for helping someone recover their lost item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting you to your dashboard...
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 max-w-2xl">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/items">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to browse items
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Report a Found Item</CardTitle>
              <CardDescription>
                Fill out the form below to report an item you found on campus.
                Be as descriptive as possible to help the owner identify their belongings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="title">Item Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="e.g., Blue iPhone 14 Pro"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Describe the item in detail - color, brand, distinguishing features, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="location">Location Found</FieldLabel>
                    <Input
                      id="location"
                      placeholder="e.g., Library Building, 2nd Floor"
                      value={formData.locationFound}
                      onChange={(e) => setFormData({ ...formData, locationFound: e.target.value })}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="date">Date Found</FieldLabel>
                    <Input
                      id="date"
                      type="date"
                      value={formData.dateFound}
                      onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Item Photo (Optional)</FieldLabel>
                    <ImageUpload
                      value={imageFile}
                      onChange={setImageFile}
                    />
                  </Field>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Spinner className="mr-2" /> : null}
                    {submitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

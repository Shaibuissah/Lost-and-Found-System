"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Search, AlertCircle } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    // Sign up the user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: formData.fullName,
          student_id: formData.studentId,
          phone: formData.phone,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // If user was created, also insert into profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          full_name: formData.fullName,
          student_id: formData.studentId,
          email: formData.email,
          phone: formData.phone || null,
        })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        // Don't show error to user - the profile might already exist or will be created on confirmation
      }
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background px-4 py-8">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-foreground">UDS Lost & Found</span>
          </Link>
          <p className="text-muted-foreground text-sm">Campus Item Recovery System</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Join the campus community to report and recover items</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <FieldGroup>
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="UDS/XXX/XXXX"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@uds.edu.gh"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number (Optional)</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner className="mr-2" /> : null}
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
        </div>
      </div>
    </div>
  )
}

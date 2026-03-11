import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  FileText, 
  Users, 
  CheckCircle,
  ArrowRight,
  Smartphone,
  Book,
  Key,
  Briefcase
} from "lucide-react"

const stats = [
  { label: "Items Reported", value: "500+" },
  { label: "Items Returned", value: "350+" },
  { label: "Active Users", value: "1,200+" },
  { label: "Success Rate", value: "70%" },
]

const howItWorks = [
  {
    step: "01",
    title: "Report a Found Item",
    description: "Found something on campus? Take a photo, describe the item, and submit a report.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Search & Browse",
    description: "Looking for something you lost? Browse through reported items or use our search filters.",
    icon: Search,
  },
  {
    step: "03",
    title: "Connect & Recover",
    description: "Found your item? Contact the finder through our secure system to arrange pickup.",
    icon: Users,
  },
]

const categories = [
  { name: "Electronics", icon: Smartphone, count: 124 },
  { name: "Books & Documents", icon: Book, count: 89 },
  { name: "Keys", icon: Key, count: 67 },
  { name: "Bags & Wallets", icon: Briefcase, count: 45 },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Trusted by the UDS Community
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6">
                Lost Something on Campus?
                <span className="text-primary"> We Can Help.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 text-pretty">
                The official lost and found platform for University for Development Studies. 
                Report found items, search for your belongings, and connect with the campus community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base px-8">
                  <Link href="/items">
                    Browse Found Items
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link href="/report">Report a Found Item</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our simple three-step process makes it easy to report and recover lost items on campus.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item) => (
                <Card key={item.step} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">
                    {item.step}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Browse by Category</h2>
                <p className="text-lg text-muted-foreground">
                  Find items faster by searching within specific categories.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/items">
                  View All Items
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.name} href={`/items?category=${encodeURIComponent(category.name)}`}>
                  <Card className="group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <category.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} items</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-balance">
                    Found Something? Help Someone Today.
                  </h2>
                  <p className="text-primary-foreground/80 max-w-md">
                    Your small act of reporting a found item can make a big difference in someone's day.
                  </p>
                </div>
                <Button asChild size="lg" variant="secondary" className="shrink-0">
                  <Link href="/report">
                    Report a Found Item
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

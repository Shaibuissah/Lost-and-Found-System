// simple local storage based "database" for development
// mimics some Supabase API used by the app but stores everything in
// browser localStorage.  Works entirely on the client side.

export type User = {
  id: string
  email: string
  password: string
  user_metadata?: Record<string, any>
}

export type Profile = {
  id: string
  full_name: string
  student_id: string
  email: string
  phone?: string | null
}

export type Category = {
  id: string
  name: string
  icon?: string
}

export type FoundItem = {
  id: string
  title: string
  description: string
  category_id: string | null
  location_found: string
  date_found: string
  image_url: string | null
  finder_id: string
  status: "available" | "claimed" | "returned"
  created_at: string
  updated_at?: string
}

// root database shape
interface DbSchema {
  users: User[]
  profiles: Profile[]
  categories: Category[]
  found_items: FoundItem[]
  storage: Record<string, Record<string, string>> // bucket -> filename -> dataUrl
  session: { userId: string | null }
}

const STORAGE_KEY = "lf_db"
const AUTH_EVENT = "lf_auth_change"

function loadDb(): DbSchema {
  if (typeof window === "undefined") {
    // server build: keep transient in-memory store
    const globalAny = global as any
    if (!globalAny.__LF_DB) {
      globalAny.__LF_DB = {
        users: [],
        profiles: [],
        categories: [],
        found_items: [],
        storage: {},
        session: { userId: null },
      }
    }
    return globalAny.__LF_DB
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  const initial: DbSchema = {
    users: [],
    profiles: [],
    categories: [],
    found_items: [],
    storage: {},
    session: { userId: null },
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveDb(db: DbSchema) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

// helpers
function uuid() {
  return Math.random().toString(36).substring(2, 10)
}

// auth helpers
export const auth = {
  async signUp({ email, password, options }: { email: string; password: string; options?: any }) {
    const db = loadDb()
    if (db.users.find((u) => u.email === email)) {
      return { data: null, error: new Error("User already exists") }
    }
    const user: User = { id: uuid(), email, password, user_metadata: options?.data }
    db.users.push(user)

    // create profile
    db.profiles.push({
      id: user.id,
      full_name: options?.data?.full_name || "",
      student_id: options?.data?.student_id || "",
      email,
      phone: options?.data?.phone || null,
    })
    saveDb(db)

    db.session.userId = user.id
    saveDb(db)
    dispatchAuthEvent(user)

    return { data: { user }, error: null }
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const db = loadDb()
    const user = db.users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return { data: null, error: new Error("Invalid credentials") }
    }
    db.session.userId = user.id
    saveDb(db)
    dispatchAuthEvent(user)
    return { data: { user }, error: null }
  },
  async getUser() {
    const db = loadDb()
    const user = db.users.find((u) => u.id === db.session.userId) || null
    return { data: { user }, error: null }
  },
  async signOut() {
    const db = loadDb()
    db.session.userId = null
    saveDb(db)
    dispatchAuthEvent(null)
    return { error: null }
  },
  onAuthStateChange(callback: (event: string, session: { user: User | null }) => void) {
    const handler = (e: any) => {
      const user = e.detail as User | null
      callback("SIGNED_IN", { user })
    }
    window.addEventListener(AUTH_EVENT, handler)
    return { data: { subscription: { unsubscribe: () => window.removeEventListener(AUTH_EVENT, handler) } } }
  },
}

function dispatchAuthEvent(user: User | null) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }))
}

// data operations
export const db = {
  getCategories(): Category[] {
    const d = loadDb()
    if (d.categories.length === 0) {
      // default categories
      d.categories = [
        { id: uuid(), name: "Electronics" },
        { id: uuid(), name: "Books" },
        { id: uuid(), name: "Wallet" },
        { id: uuid(), name: "Keys" },
      ]
      saveDb(d)
    }
    return d.categories
  },
  getItems(filters?: Partial<FoundItem> & { search?: string; sort?: string }) {
    const d = loadDb()
    let items = [...d.found_items]
    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        items = items.filter((i) =>
          i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
        )
      }
      if (filters.category_id) {
        items = items.filter((i) => i.category_id === filters.category_id)
      }
      if (filters.status) {
        items = items.filter((i) => i.status === filters.status)
      }
      if (filters.finder_id) {
        items = items.filter((i) => i.finder_id === filters.finder_id)
      }
    }
    if (filters?.sort === "oldest") {
      items.sort((a, b) => a.created_at.localeCompare(b.created_at))
    } else {
      items.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    return items
  },
  getItemById(id: string) {
    const d = loadDb()
    return d.found_items.find((i) => i.id === id) || null
  },
  insertItem(item: FoundItem) {
    const d = loadDb()
    d.found_items.push(item)
    saveDb(d)
    return { error: null }
  },
  updateItem(id: string, updates: Partial<FoundItem>) {
    const d = loadDb()
    const idx = d.found_items.findIndex((i) => i.id === id)
    if (idx === -1) return { error: new Error("Not found") }
    d.found_items[idx] = { ...d.found_items[idx], ...updates }
    saveDb(d)
    return { error: null }
  },
  deleteItem(id: string) {
    const d = loadDb()
    d.found_items = d.found_items.filter((i) => i.id !== id)
    saveDb(d)
    return { error: null }
  },
  getProfile(userId: string) {
    const d = loadDb()
    return d.profiles.find((p) => p.id === userId) || null
  },
  uploadImage(bucket: string, file: File): Promise<{ publicUrl: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const d = loadDb()
        if (!d.storage[bucket]) d.storage[bucket] = {}
        const filename = `${userId()}/${Date.now()}-${file.name}`
        d.storage[bucket][filename] = dataUrl
        saveDb(d)
        resolve({ publicUrl: dataUrl })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
}

function userId() {
  const d = loadDb()
  return d.session.userId || "anon"
}

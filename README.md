# Lost and Found System

This repository contains a Next.js application for a university lost & found
system. Users can report and browse found items, manage profiles, and
authenticate with a simple local-storage backend. The codebase is built with
TypeScript and Tailwind CSS and is intended for offline/local development.

## Features

- User authentication (sign up, login, sign out)
- Dashboard to view and manage reported items
- Browse items with filters and categories
- Responsive layout with mobile support
- Client-side storage using browser `localStorage` for data and sessions

## Tech Stack

- [Next.js 16](https://nextjs.org) (with React 19)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- Browser `localStorage` for data persistence (no external service)
- [Radix UI](https://www.radix-ui.com) components via shadcn/ui
- Additional UI libraries: `lucide-react`, `react-hook-form`, `date-fns`, etc.

## Getting Started

This project no longer requires any environment variables. All data is stored in
`localStorage`, so you can simply run the development server and start using the
app. Existing database migration scripts remain for reference but are not used.



### Prerequisites

- Node.js (18+ preferred)
- Git
- (previously) A Supabase project - now removed in favor of local storage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaibuissah/Lost-and-Found-System.git
   cd Lost-and-Found-System
   ```

2. Install dependencies (the project uses `npm`; `pnpm` or `yarn` also work):
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add the following
   environment variables (replace with your Supabase values):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=... # optional if you use server-only APIs
   # (optional) for email redirects during development:
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

   **Production deployments (e.g. Vercel)** *must* have at least the URL and
   anon key defined. The build will throw an error otherwise to avoid
   silently running with a stubbed client. On Vercel, set them under
   **Project Settings → Environment Variables**; make sure to add the values
   for both `Preview` and `Production` environments.

   If you don't supply these variables locally, the application will run with
   stubbed Supabase clients; you can still view and navigate the UI but user
   creation, login, and database queries will be no-ops and no data will be
   persisted.
   ```

5. Open http://localhost:3000 (or whichever port is shown) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

### Database Migrations / Schema

SQL scripts are available in the `scripts/` directory to create tables:

- `001_create_profiles.sql`
- `002_create_found_items.sql`
- `003_create_categories.sql`
- `004_setup_storage.sql`

*(Schema scripts are no longer needed; historic SQL files remain for reference.)*

## Project Structure

```
app/                # Next.js App Router pages and layouts
components/         # Shared UI components
lib/localDb.ts       # In-browser database and authentication API using localStorage
hooks/              # Custom React hooks
public/             # Static assets
scripts/            # Database setup SQL
styles/             # Global CSS
tsconfig.json       # TypeScript config
package.json        # npm scripts and dependencies
```

## Development Notes

- The stubbed Supabase clients (in `lib/supabase/{client,server}.ts`) allow the
  app to run without connecting to a real Supabase project. They return
  no-op objects for auth and query methods.
- UI styling leverages Tailwind CSS and a custom design system (`components/ui`).
- There are client and server data-fetching examples throughout the `app/`
  directory.

## Troubleshooting

- **"Port 3000 is in use"** – stop the other Next.js instance or kill the
  process. Use `npx kill-port 3000`.
- **Turbopack panics** – use webpack by running `npm run dev` (script now passes `--turbo=false`) or delete the `.next` folder if issues persist.
- **Supabase runtime errors** – ensure environment variables are set or rely on
  the stub client during development.

## License

This project is provided as-is. Add your license information here.

---

For further questions or contributions, feel free to open an issue or pull
request on the GitHub repository.
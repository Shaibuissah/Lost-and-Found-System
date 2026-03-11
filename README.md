# Lost and Found System

This repository contains a Next.js application for a university lost & found
system. The project provides a web UI for users to report and browse found items,
manage profiles, and handle authentication using Supabase. The codebase is built
with TypeScript and Tailwind CSS, and includes a client/server Supabase
integration with session middleware.

## Features

- User authentication (sign up, login, sign out)
- Dashboard to view and manage reported items
- Browse items with filters and categories
- Responsive layout with mobile support
- Supabase-backed data storage (`profiles`, `found_items`, `categories`)
- API routes and middleware for session handling

## Tech Stack

- [Next.js 16](https://nextjs.org) (with React 19)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) for authentication and database
- [Radix UI](https://www.radix-ui.com) components via shadcn/ui
- Additional UI libraries: `lucide-react`, `react-hook-form`, `date-fns`, etc.

## Getting Started

### Prerequisites

- Node.js (18+ preferred)
- Git
- A Supabase project (optional if you want full functionality)

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
   SUPABASE_SERVICE_ROLE_KEY=... # optional
   ```

   If you don't supply these variables, the application will run locally with
   stubbed Supabase clients; you can still view and navigate the UI but no data
   will be persisted.

4. Start the development server:
   ```bash
   # disable Turbopack if you encounter errors
   DISABLE_TURBOPACK=1 npm run dev
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

Run these against your Supabase/Postgres instance to set up the schema.

## Project Structure

```
app/                # Next.js App Router pages and layouts
components/         # Shared UI components
lib/supabase/       # Supabase client helpers (client.ts, server.ts, proxy.ts)
hooks/              # Custom React hooks
public/             # Static assets
scripts/            # Database setup SQL
styles/             # Global CSS
tsconfig.json       # TypeScript config
package.json        # npm scripts and dependencies
```

## Development Notes

- `middleware.ts` uses `updateSession` from `lib/supabase/proxy.ts` to
  synchronize auth cookies on each request. It gracefully does nothing if no
  environment variables are defined.
- The stubbed Supabase clients (in `lib/supabase/{client,server}.ts`) allow the
  app to run without connecting to a real Supabase project. They return
  no-op objects for auth and query methods.
- UI styling leverages Tailwind CSS and a custom design system (`components/ui`).
- There are client and server data-fetching examples throughout the `app/`
  directory.

## Troubleshooting

- **"Port 3000 is in use"** – stop the other Next.js instance or kill the
  process. Use `npx kill-port 3000`.
- **Turbopack panics** – set `DISABLE_TURBOPACK=1` before running `npm run dev`.
- **Supabase runtime errors** – ensure environment variables are set or rely on
  the stub client during development.

## License

This project is provided as-is. Add your license information here.

---

For further questions or contributions, feel free to open an issue or pull
request on the GitHub repository.
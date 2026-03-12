# Quick Start - Get Your Supabase Credentials

## Step 1: Get Your Supabase Project URL and API Key

### Option A: If you already have a Supabase project

1. Go to https://supabase.com/dashboard
2. Click on your project
3. Click on the **Settings** icon (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. You'll see two important values:

   **Project URL** (looks like this):
   ```
   https://uzdlknbmyzlxcbwpuvyk.supabase.co
   ```

   **anon public key** (very long, looks like this):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZGxrbmJteXpseGNid3B1dnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MjU5NzcsImV4cCI6MjA1MjEwMTk3N30.Ks-Ql-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu
   ```

6. Copy these values and paste them into your `.env.local` file

### Option B: If you DON'T have a Supabase project yet

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign in with GitHub (recommended) or email
4. Click **New Project**
5. Fill in:
   - **Name**: lost-and-found
   - **Database Password**: Create a strong password (save it somewhere!)
   - **Region**: Choose closest to you
6. Click **Create new project**
7. Wait 2-3 minutes for setup to complete
8. Follow "Option A" above to get your credentials

## Step 2: Run Database Setup Scripts

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the contents of `scripts/001_create_profiles.sql` and paste it
4. Click **Run** (or press Ctrl+Enter)
5. Repeat for:
   - `scripts/002_create_found_items.sql`
   - `scripts/003_create_categories.sql`
   - `scripts/004_setup_storage.sql`
   - `scripts/005_create_profile_trigger.sql` ⚠️ **IMPORTANT - Don't skip this!**

## Step 2.5: Disable Email Confirmation (Optional but Recommended for Testing)

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Click on **Email** provider
3. Scroll down to find "Confirm email"
4. Toggle it **OFF**
5. Click **Save**

This allows you to test sign-up without needing to confirm emails.

## Step 3: Update .env.local

Open `.env.local` and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-very-long-anon-key-here
```

## Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000 and test:
1. Sign up for an account
2. Report a test item
3. Open in another browser - you should see the item!

## Troubleshooting

### "Invalid API key" or "Failed to fetch"
- Your `.env.local` values are incorrect
- Go back to Supabase dashboard > Settings > API and copy the correct values
- Make sure the URL starts with `https://` and ends with `.supabase.co`
- Make sure the anon key is the full long string (starts with `eyJ`)

### Can't see items in other browsers
- Check if the SQL scripts ran successfully (no red errors)
- Check Supabase Table Editor to see if tables were created
- Check browser console for errors (F12)

### Need help?
Check the full guide in `SUPABASE_SETUP.md`

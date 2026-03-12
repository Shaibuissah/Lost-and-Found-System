# Supabase Setup Guide

This guide will help you set up Supabase for the Lost & Found system so items are visible across all browsers.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed on your system

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `lost-and-found` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for it to initialize (takes ~2 minutes)

## Step 2: Run Database Migrations

1. In your Supabase project dashboard, go to the SQL Editor (left sidebar)
2. Run each SQL script in order:

### Script 1: Create Profiles Table
Copy and paste the contents of `scripts/001_create_profiles.sql` and click "Run"

### Script 2: Create Found Items Table
Copy and paste the contents of `scripts/002_create_found_items.sql` and click "Run"

### Script 3: Create Categories Table
Copy and paste the contents of `scripts/003_create_categories.sql` and click "Run"

### Script 4: Setup Storage
Copy and paste the contents of `scripts/004_setup_storage.sql` and click "Run"

### Script 5: Create Profile Trigger (IMPORTANT!)
Copy and paste the contents of `scripts/005_create_profile_trigger.sql` and click "Run"

This creates an automatic trigger that creates user profiles when they sign up.

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, go to Settings > API
2. You'll need two values:
   - **Project URL**: Found under "Project URL"
   - **Anon/Public Key**: Found under "Project API keys" > "anon public"

## Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add the following content (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 5: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000 in your browser
3. Create a new account via Sign Up
4. Report a test item
5. Open the same URL in a different browser or incognito window
6. You should see the item you just reported!

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the correct anon key from Supabase
- Make sure there are no extra spaces in your `.env.local` file
- Restart your development server after changing `.env.local`

### Items not showing up
- Check the browser console for errors
- Verify all SQL scripts ran successfully in Supabase
- Check the Supabase Table Editor to see if data is being inserted

### Sign up not working
- Make sure the profiles table was created successfully
- Check Supabase Authentication settings (should be enabled by default)
- Look for errors in the browser console

### Image upload failing
- Verify the storage bucket was created (check Storage in Supabase dashboard)
- Check that the bucket is set to "public"
- Ensure the storage policies were created correctly

## Security Notes

- The `.env.local` file is already in `.gitignore` - never commit it to version control
- The anon key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies protect your data:
  - Anyone can view items (public browsing)
  - Only authenticated users can create items
  - Users can only edit/delete their own items

## Next Steps

Once everything is working:
1. Customize the categories in the Supabase Table Editor if needed
2. Consider setting up email authentication in Supabase Auth settings
3. Deploy your app to Vercel or another hosting platform
4. Add the same environment variables to your production deployment

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for client-side errors
3. Verify all database tables and policies are set up correctly

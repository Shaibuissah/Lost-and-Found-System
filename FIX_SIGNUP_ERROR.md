# Fix Sign Up Error - Profile Creation

## The Problem
You're seeing: `"insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"`

This happens because we're trying to manually create a profile, but the better approach is to use a database trigger that automatically creates the profile when a user signs up.

## The Solution

Run this NEW SQL script in your Supabase SQL Editor:

### Step 1: Go to Supabase SQL Editor
1. Open your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run the Profile Trigger Script
Copy and paste the contents of `scripts/005_create_profile_trigger.sql` and click **Run**

This creates a database trigger that automatically creates a profile whenever a new user signs up through Supabase Auth.

### Step 3: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test Sign Up Again
1. Go to http://localhost:3000/auth/sign-up
2. Fill in the form with:
   - Full Name: Test User
   - Student ID: UDS/TEST/2024
   - Email: test@example.com
   - Password: test123
3. Click "Create account"
4. You should now be able to sign up successfully!

## What Changed?

**Before:** The app tried to manually insert into the profiles table after creating the user, which caused a foreign key error.

**After:** A database trigger automatically creates the profile when Supabase Auth creates the user, ensuring the foreign key relationship is maintained.

## Troubleshooting

### Still getting the error?
1. Make sure you ran the trigger script (`005_create_profile_trigger.sql`)
2. Check if the trigger was created:
   - In Supabase, go to **Database** > **Functions**
   - You should see `handle_new_user` function
3. Try deleting any test users:
   - Go to **Authentication** > **Users**
   - Delete any test accounts
   - Try signing up again

### Email confirmation required?
If you see "Please check your email to confirm your account":
1. Go to Supabase dashboard > **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. Toggle OFF "Enable email confirmations"
4. Click **Save**
5. Try signing up again

### Need to reset everything?
If you want to start fresh:
1. Go to **SQL Editor**
2. Run this to clear all data:
```sql
TRUNCATE auth.users CASCADE;
TRUNCATE public.profiles CASCADE;
TRUNCATE public.found_items CASCADE;
```
3. Try signing up again

# 🚨 URGENT: Run All Database Scripts

## You're seeing: "Could not find the table 'public.found_items'"

This means your database tables haven't been created yet. You need to run ALL the SQL scripts.

---

## ⚡ Quick Fix (5 minutes)

### Go to Supabase SQL Editor

1. Open https://supabase.com/dashboard
2. Click your project
3. Click **SQL Editor** (left sidebar)

### Run Each Script in Order

For each script below:
1. Click **New query**
2. Copy the ENTIRE content from the file
3. Paste into the editor
4. Click **Run** (or Ctrl+Enter)
5. Wait for "Success. No rows returned"
6. Move to next script

---

## 📝 Scripts to Run (IN THIS ORDER!)

### ✅ Script 1: Create Profiles Table
**File:** `scripts/001_create_profiles.sql`

This creates the user profiles table.

---

### ✅ Script 2: Create Categories Table
**File:** `scripts/003_create_categories.sql`

This creates categories (Electronics, Books, etc.) and inserts default values.

**⚠️ Run this BEFORE found_items because found_items references categories!**

---

### ✅ Script 3: Create Found Items Table
**File:** `scripts/002_create_found_items.sql`

This creates the main table for lost items. **This is the one you're missing!**

---

### ✅ Script 4: Setup Storage
**File:** `scripts/004_setup_storage.sql`

This creates the storage bucket for images.

---

### ✅ Script 5: Create Profile Trigger
**File:** `scripts/005_create_profile_trigger.sql`

This automatically creates profiles when users sign up.

---

## 🔍 Verify Tables Were Created

After running all scripts:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `categories`
   - ✅ `found_items`

3. Go to **Storage**
4. You should see:
   - ✅ `item-images` bucket

---

## 🧪 Test After Running Scripts

1. Restart your dev server:
```bash
npm run dev
```

2. Go to http://localhost:3000/report

3. Fill in the form and submit

4. ✅ Should work now!

---

## 🐛 Troubleshooting

### "relation does not exist" errors
- You're running scripts out of order
- Run categories (003) BEFORE found_items (002)

### "foreign key constraint" errors
- Run profiles (001) first
- Then categories (003)
- Then found_items (002)

### Still getting errors?
- Delete all tables and start fresh
- Run scripts in exact order: 001 → 003 → 002 → 004 → 005

---

## 📋 Quick Checklist

After running all scripts, verify:

- [ ] Table Editor shows `profiles` table
- [ ] Table Editor shows `categories` table (with 8 rows of data)
- [ ] Table Editor shows `found_items` table
- [ ] Storage shows `item-images` bucket
- [ ] Database > Functions shows `handle_new_user` function

---

**Once all scripts are run, your database will be ready and the app will work!** 🎉

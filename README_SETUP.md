# 🚀 Quick Setup - Start Here!

## Current Issue: "Bucket not found"

You need to create the storage bucket for images. Here's how:

---

## ⚡ Quick Fix (2 minutes)

### Option 1: Run SQL Script (Easiest)

1. Open Supabase dashboard → **SQL Editor**
2. Copy content from `scripts/004_setup_storage.sql`
3. Paste and click **Run**
4. Done! ✅

### Option 2: Create Manually

1. Supabase → **Storage** → **New bucket**
2. Name: `item-images`
3. Public: **ON**
4. Click **Create**

---

## 📝 Full Setup Checklist

If you haven't done these yet:

### ☐ 1. Configure Environment
- [ ] Add Supabase URL to `.env.local`
- [ ] Add Supabase anon key to `.env.local`

### ☐ 2. Run Database Scripts (in order)
- [ ] `001_create_profiles.sql`
- [ ] `002_create_found_items.sql`
- [ ] `003_create_categories.sql`
- [ ] `004_setup_storage.sql` ⚠️ **YOU ARE HERE**
- [ ] `005_create_profile_trigger.sql`

### ☐ 3. Enable Email Auth
- [ ] Authentication → Providers → Email → **ON**
- [ ] Confirm email → **OFF**

### ☐ 4. Test
- [ ] Sign up works
- [ ] Report item works (with image)
- [ ] Browse items works
- [ ] Items visible in other browsers

---

## 🎯 After Fixing Storage

1. Restart dev server: `npm run dev`
2. Go to http://localhost:3000/report
3. Try uploading an image
4. Should work! ✅

---

## 📚 Detailed Guides

- **COMPLETE_SETUP_GUIDE.md** - Full step-by-step guide
- **FIX_STORAGE_ERROR.md** - Detailed storage bucket fix
- **FIX_SIGNUP_ERROR.md** - Fix profile creation issues
- **SUPABASE_SETUP.md** - Complete Supabase documentation

---

## 🆘 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Bucket not found" | Run `004_setup_storage.sql` |
| "Email signups disabled" | Enable Email provider in Auth settings |
| "Foreign key constraint" | Run `005_create_profile_trigger.sql` |
| "Invalid API key" | Check `.env.local` credentials |

---

**Start with:** `COMPLETE_SETUP_GUIDE.md` for the full walkthrough!

# Setup Checklist - Fix the Sign Up Error

Follow these steps in order:

## ✅ Step 1: Run the Profile Trigger Script

**This is the most important step to fix your error!**

1. Open Supabase dashboard: https://supabase.com/dashboard
2. Click your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy ALL the content from `scripts/005_create_profile_trigger.sql`
6. Paste it into the SQL editor
7. Click **Run** (or Ctrl+Enter)
8. You should see "Success. No rows returned"

## ✅ Step 2: Disable Email Confirmation (Makes Testing Easier)

1. In Supabase, go to **Authentication** > **Providers**
2. Click **Email**
3. Find "Confirm email" toggle
4. Turn it **OFF**
5. Click **Save**

## ✅ Step 3: Restart Your Dev Server

```bash
# Press Ctrl+C to stop the server
# Then run:
npm run dev
```

## ✅ Step 4: Test Sign Up

1. Go to http://localhost:3000/auth/sign-up
2. Fill in the form:
   - Full Name: Your Name
   - Student ID: UDS/TEST/2024
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create account"
4. ✅ Success! You should be redirected to the success page

## ✅ Step 5: Test Browsing Items

1. After signing up, click "Report Item"
2. Fill in the form and submit a test item
3. Go to "Browse Items"
4. You should see your item!
5. Open the same URL in another browser or incognito window
6. ✅ You should see the same item! (This proves it's using the real database)

## Troubleshooting

### Still getting the foreign key error?
- Make sure you ran `scripts/005_create_profile_trigger.sql`
- Check if the function exists: Database > Functions > look for `handle_new_user`

### "Please check your email" message?
- You didn't disable email confirmation (see Step 2)

### "Invalid API key" error?
- Your `.env.local` has wrong credentials
- Get the correct values from: Settings > API in Supabase dashboard

### Items not showing in other browsers?
- Check if the SQL scripts ran successfully (no errors)
- Check browser console for errors (F12)
- Verify data in Supabase: Table Editor > found_items

## Need More Help?

Check these files:
- `FIX_SIGNUP_ERROR.md` - Detailed explanation of the fix
- `QUICK_START.md` - Complete setup guide
- `SUPABASE_SETUP.md` - Full documentation

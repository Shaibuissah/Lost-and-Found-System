# Fix "Bucket not found" Error

## The Problem
When trying to upload an image while reporting an item, you see: `"Bucket not found"`

This means the storage bucket for images hasn't been created in Supabase yet.

## Solution: Create the Storage Bucket

### Method 1: Run SQL Script (Easiest)

1. Go to your Supabase dashboard → **SQL Editor**
2. Click **New query**
3. Copy ALL the content from `scripts/004_setup_storage.sql`
4. Paste it into the editor
5. Click **Run** (or Ctrl+Enter)
6. You should see "Success. No rows returned"

### Method 2: Create Manually in Supabase UI

1. Go to **Storage** in your Supabase dashboard (left sidebar)
2. Click **New bucket**
3. Fill in the details:
   - **Name**: `item-images`
   - **Public bucket**: Toggle **ON** ✅
   - **File size limit**: 5242880 (that's 5MB in bytes)
   - **Allowed MIME types**: 
     ```
     image/jpeg,image/png,image/webp,image/gif
     ```
4. Click **Create bucket**

5. After creating, you need to set up policies:
   - Click on the `item-images` bucket
   - Go to **Policies** tab
   - Click **New policy**
   - Create these policies:
     - **SELECT (read)**: Allow public access
     - **INSERT (upload)**: Allow authenticated users
     - **UPDATE**: Allow users to update their own images
     - **DELETE**: Allow users to delete their own images

### Method 3: Test Without Images (Temporary)

I've already updated the code to handle missing buckets gracefully. Now you can:

1. Try submitting a report WITHOUT uploading an image
2. The item will be created successfully
3. Come back later and run the storage script to enable images

## Verify It Works

After creating the bucket:

1. Restart your dev server (if needed)
2. Go to http://localhost:3000/report
3. Fill in the form
4. Upload an image
5. Click "Submit Report"
6. ✅ Should work now!

## Check if Bucket Exists

To verify the bucket was created:

1. Go to **Storage** in Supabase dashboard
2. You should see `item-images` bucket listed
3. It should show as "Public"

## Troubleshooting

### Still getting "Bucket not found"?
- Make sure you ran the SQL script or created the bucket manually
- Check Storage in Supabase dashboard - is `item-images` there?
- Try refreshing your browser

### "Row Level Security" errors?
- The SQL script creates the necessary policies
- If you created the bucket manually, you need to add policies (see Method 2)

### Images not showing?
- Make sure the bucket is set to **Public**
- Check the policies allow public SELECT access

## What Changed in the Code?

I updated `app/report/page.tsx` to:
- Continue submitting even if image upload fails
- Show a warning but don't block the submission
- Log errors to console for debugging

This means you can test the app without images while you set up storage!

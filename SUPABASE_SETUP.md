# Supabase Setup Guide

This guide will help you set up Supabase for the Escape Room Leaderboard system.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `escape-room-leaderboard` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to your users
6. Click "Create new project"

## 2. Set Up the Database Table

Once your project is created, go to the SQL Editor and run this SQL:

```sql
-- Create the leaderboard table
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  total_time INTEGER NOT NULL,
  task_times JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_leaderboard_total_time ON leaderboard(total_time);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow public read access to leaderboard
CREATE POLICY "Allow public read access" ON leaderboard
FOR SELECT USING (true);

-- Allow public insert access (for submitting scores)
CREATE POLICY "Allow public insert access" ON leaderboard
FOR INSERT WITH CHECK (true);

-- Optional: Allow authenticated users to delete (for admin purposes)
CREATE POLICY "Allow authenticated delete" ON leaderboard
FOR DELETE USING (true);
```

## 3. Get Your Project Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API"
4. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: The long string starting with `eyJ...`

## 4. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase project credentials.

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the leaderboard page
3. Try submitting a test score
4. Check your Supabase dashboard to see if the data appears

## 6. Deploy to Azure Static Web App

When deploying to Azure Static Web App, you'll need to set the environment variables in the Azure portal:

1. Go to your Azure Static Web App
2. Click on "Configuration"
3. Add the following Application Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

## 7. Security Considerations

- The anon key is safe to expose in the client as it's designed for public access
- Row Level Security (RLS) policies control what users can do
- Consider implementing rate limiting for production use
- Monitor your Supabase usage to stay within free tier limits

## 8. Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"Error submitting score"**
   - Check the browser console for detailed error messages
   - Verify your RLS policies are set up correctly
   - Ensure your Supabase project is active

3. **Data not appearing in Supabase**
   - Check the Network tab in browser dev tools for failed requests
   - Verify your table structure matches the expected schema
   - Check Supabase logs in the dashboard

### Useful Commands:

```bash
# Check if environment variables are loaded
npm run dev

# Build for production
npm run build

# Test the build locally
npm run start
```

## 9. Monitoring and Analytics

In your Supabase dashboard, you can:

- View real-time data in the Table Editor
- Monitor API usage in the API section
- Set up alerts for usage limits
- View logs for debugging

## 10. Backup and Migration

To backup your leaderboard data:

1. Go to Supabase Dashboard → Settings → Database
2. Click "Backups" to download a full database backup
3. Or use the export functionality in the leaderboard page

To migrate data from localStorage to Supabase:

1. Export your existing localStorage data
2. Use the import functionality in the new leaderboard page
3. The data will be automatically migrated to Supabase

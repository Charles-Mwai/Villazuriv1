# Admin Password Setup Instructions

## ✅ What Was Changed

1. **Created**: `/api/verify-admin.js` - Serverless function for secure password verification
2. **Updated**: `/src/pages/Admin/Login.jsx` - Now calls backend API instead of checking password in frontend

## 🔧 Setup Steps

### Step 1: Remove VITE_ADMIN_PASSWORD from `.env`

Open your `.env` or `.env.local` file and **remove** this line:
```bash
VITE_ADMIN_PASSWORD=your-password  # ❌ DELETE THIS
```

Keep only these frontend variables:
```bash
VITE_SUPABASE_URL=https://ftewmycurmankxaqsdgz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Add ADMIN_PASSWORD to Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your VillaZuri project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: `your-secure-password` (choose a strong password)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 3: Redeploy (if already deployed)

If your site is already live on Vercel:
- Go to **Deployments** tab
- Click the **⋯** menu on the latest deployment
- Select **Redeploy**

Or just push a new commit and it will auto-deploy.

### Step 4: Test Locally (Development)

For local development, you have two options:

**Option A: Use Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Link your project
vercel link

# Pull environment variables from Vercel
vercel env pull .env.local

# Run dev server
npm run dev
```

**Option B: Manual Setup**
Create `.env.local` and add:
```bash
ADMIN_PASSWORD=your-dev-password
```

Then run:
```bash
npm run dev
```

## 🔒 Security Benefits

✅ **Before**: Password visible in browser JavaScript bundle  
✅ **After**: Password only exists on server, never exposed to client

## 🧪 Testing

1. Navigate to `/admin/login`
2. Enter your password
3. Should redirect to `/admin/dashboard` on success
4. Should show error message on invalid password

## ⚠️ Important Notes

- The password is now **server-side only** (not in frontend code)
- You can change the password anytime in Vercel environment variables
- For production use, consider implementing Supabase Auth for better security
- Session expires based on `admin_login_time` in localStorage (can be enhanced)

## 🚀 Next Steps (Future Enhancement)

When ready, migrate to Supabase Auth for:
- Secure password hashing
- Session management
- Password reset functionality
- Multi-user support

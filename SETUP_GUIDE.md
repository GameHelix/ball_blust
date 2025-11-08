# Quick Setup Guide

Follow these steps to get your restaurant menu app running quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Neon Database

1. Visit [neon.tech](https://neon.tech)
2. Sign up/login
3. Create a new project
4. Copy the connection string from the dashboard

Your connection string looks like:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

## Step 3: Set Up Cloudflare R2

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to R2 Object Storage
3. Create a bucket (e.g., "restaurant-menu-images")
4. Go to "Manage R2 API Tokens"
5. Click "Create API Token"
6. Give it read & write permissions
7. Save the following:
   - Access Key ID
   - Secret Access Key
   - Your Account ID (found in R2 overview)

For public URL, you can:
- Option A: Use R2 custom domain
- Option B: Enable public access on the bucket

## Step 4: Create .env File

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# From Neon Dashboard
DATABASE_URL="postgresql://..."

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# From Cloudflare R2
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"

# Your choice
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

## Step 5: Initialize Database

```bash
npm run db:push
npm run setup
```

## Step 6: Run the App

```bash
npm run dev
```

Visit:
- Public menu: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

Login with the credentials you set in `.env`

## Step 7: Add Your First Content

1. Login to admin panel
2. Go to "Restaurant Settings"
   - Add restaurant name, logo, description
3. Go to "Categories"
   - Create categories (e.g., "Appetizers", "Main Courses", "Desserts")
4. Go to "Menu Items"
   - Add items with photos, prices, descriptions

## Deploy to Vercel

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add ALL environment variables from `.env`
6. Update `NEXTAUTH_URL` to your Vercel URL
7. Deploy!

8. After deployment, run setup again:
```bash
npm run setup
```

## Troubleshooting

### Can't connect to database
- Check DATABASE_URL is correct
- Verify Neon project is active
- Check SSL mode is enabled

### Images not uploading
- Verify R2 credentials
- Check bucket name is correct
- Ensure API token has write permissions

### Can't login
- Verify admin user was created (run `npm run setup`)
- Check NEXTAUTH_SECRET is set
- Clear browser cookies

## Next Steps

- Customize the design in Tailwind CSS
- Add more categories and menu items
- Share your public menu URL with customers
- Consider adding QR codes for table scanning

## Need Help?

- Check README.md for detailed documentation
- Review .env.example for all configuration options
- Visit the respective service docs (Neon, Cloudflare, Next.js)

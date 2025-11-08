# Restaurant Menu Management System

A full-stack restaurant menu application with an admin panel built with Next.js, PostgreSQL, and Cloudflare R2 storage.

## Features

- **Admin Dashboard**: Complete CRUD operations for managing restaurant info, categories, and menu items
- **Image Upload**: Logo and menu item images stored in Cloudflare R2
- **Public Menu**: Beautiful, responsive menu display for customers
- **Authentication**: Secure admin login with NextAuth.js
- **Database**: PostgreSQL database hosted on Neon
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Neon PostgreSQL database
- A Cloudflare account with R2 storage
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a new project
2. Create a new database
3. Copy the connection string (it should look like: `postgresql://username:password@xxx.neon.tech/dbname?sslmode=require`)

### 3. Set Up Cloudflare R2

1. Go to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Create a new bucket for your restaurant images
4. Create an R2 API token:
   - Go to "Manage R2 API Tokens"
   - Create a new API token with read/write permissions
   - Save the Access Key ID and Secret Access Key
5. Set up public access for your bucket (optional, for public menu images)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="your-neon-database-url"

# NextAuth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://your-public-url.r2.dev"

# Admin credentials (for initial setup)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Initialize Database

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 6. Create Admin User

Run the setup script to create your admin account:

```bash
npm run setup
```

This will create an admin user with the email and password from your `.env` file.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public menu.

Access the admin panel at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add all environment variables from your `.env` file
5. Update `NEXTAUTH_URL` to your production URL (e.g., `https://your-app.vercel.app`)
6. Deploy

### 3. Run Database Migration

After deployment, you may need to push the schema again:

```bash
npx prisma db push
```

### 4. Create Admin User in Production

Run the setup script with your production database:

```bash
npm run setup
```

## Usage

### Admin Panel

1. Login at `/admin/login` with your admin credentials
2. Navigate to different sections:
   - **Dashboard**: Overview of your menu
   - **Restaurant Info**: Update restaurant name, logo, description, contact info
   - **Categories**: Create and manage menu categories
   - **Menu Items**: Add menu items with images, prices, and descriptions

### Public Menu

- Visit the homepage to see the public-facing menu
- Menu automatically displays active categories and available items
- Responsive design works on mobile, tablet, and desktop

## Database Schema

- **User**: Admin users for authentication
- **Restaurant**: Restaurant information (name, logo, contact info)
- **Category**: Menu categories (Appetizers, Main Courses, etc.)
- **MenuItem**: Individual menu items with images, prices, descriptions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run setup` - Create admin user

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth routes
│   │   ├── categories/     # Category CRUD
│   │   ├── menu-items/     # Menu item CRUD
│   │   ├── restaurant/     # Restaurant info
│   │   └── upload/         # Image upload
│   ├── admin/              # Admin panel
│   │   ├── login/         # Login page
│   │   └── dashboard/     # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Public menu page
├── lib/                     # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── r2.ts              # R2 storage utilities
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   └── setup.ts           # Database setup script
└── types/
    └── next-auth.d.ts     # TypeScript definitions
```

## Security Notes

- Never commit your `.env` file
- Use strong passwords for admin accounts
- Keep your API keys and secrets secure
- Enable HTTPS in production (Vercel does this automatically)
- Regularly update dependencies

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure your IP is allowed in Neon's settings
- Check that SSL mode is enabled

### Image Upload Issues
- Verify R2 credentials are correct
- Check bucket permissions
- Ensure CORS is configured if needed

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## Support

For issues or questions, please check:
- Neon documentation: https://neon.tech/docs
- Cloudflare R2 documentation: https://developers.cloudflare.com/r2/
- Next.js documentation: https://nextjs.org/docs
- Prisma documentation: https://www.prisma.io/docs

## License

MIT

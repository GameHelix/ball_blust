# Restaurant Menu Management System

A full-stack restaurant menu application with an admin panel built with Next.js, PostgreSQL, and Cloudflare R2 storage. Perfect for restaurants, cafes, and food service businesses looking to digitize their menu with easy management capabilities.

## Live Demo

- **Public Menu**: [https://menu-bay-gamma.vercel.app](https://menu-bay-gamma.vercel.app)
- **Admin Panel**: [https://menu-bay-gamma.vercel.app/admin/login](https://menu-bay-gamma.vercel.app/admin/login)

## Features

### Public Menu
- **Responsive Design**: Beautiful menu display optimized for mobile, tablet, and desktop
- **Category Navigation**: Sticky navigation bar for easy browsing between menu sections
- **Image Display**: High-quality images for menu items stored in Cloudflare R2
- **Restaurant Branding**: Display restaurant logo, description, and contact information
- **Smart Layout**: Grid layout that adapts to screen size

### Admin Panel
- **Secure Authentication**: Login system with persistent sessions (30-day duration)
- **Dashboard Overview**: Quick stats showing total categories, menu items, and setup status
- **Restaurant Management**: Update restaurant name, logo, description, address, phone, and email
- **Category Management**: Create, edit, delete, and reorder menu categories
- **Menu Item Management**: Full CRUD operations for menu items with image upload
- **Image Upload**: Direct upload to Cloudflare R2 storage
- **Status Controls**: Toggle item availability and visibility
- **Responsive Admin UI**: Mobile-friendly admin panel with hamburger menu

## Screenshots

### Public Menu

**Home Page with Category Navigation**
![Public Menu](screenshots/menu.png)

The public menu features:
- Restaurant logo and information header
- Sticky category navigation bar for quick access
- Clean card-based layout for menu items
- Item images, names, descriptions, and prices
- Fully responsive design

**Scrolling Through Categories**
![Menu Scrolling](screenshots/menu_page_Scrolling.png)

Categories are organized with:
- Section headers for each category
- Grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- High-quality food images
- Clear pricing display

### Admin Panel

**Admin Login**
![Admin Login](screenshots/admin%20login.png)

Secure login page with:
- Email and password authentication
- Clean, centered design
- Mobile-responsive form
- Session persistence (30-day sessions)

**Admin Dashboard**
![Admin Dashboard](screenshots/admin%20dashboard.png)

Dashboard provides:
- Overview statistics (total categories, menu items)
- Restaurant setup status
- Quick action buttons for common tasks
- Sidebar navigation (hamburger menu on mobile)

**Restaurant Settings**
![Restaurant Settings](screenshots/restaurant%20setting%20page.png)

Manage your restaurant information:
- Upload restaurant logo
- Edit name and description
- Update address and contact details
- Real-time preview of changes

**Categories Management**
![Categories Admin](screenshots/categories%20admin%20page.png)

Category management interface:
- List view with all categories
- Edit category names and descriptions
- Set display order
- Toggle active/inactive status
- Item count per category
- Quick add, edit, and delete actions

**Menu Items Management**
![Menu Items Admin](screenshots/menu%20items%20admin%20page.png)

Menu item management features:
- Thumbnail preview of item images
- Item name and description
- Category assignment
- Price display
- Active/Available status badges
- Edit and delete actions
- Add new items with image upload

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **TypeScript**: Full type safety

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Neon PostgreSQL database
- A Cloudflare account with R2 storage
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd menu
npm install
```

### 2. Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a new project
2. Create a new database
3. In the database, create a schema named "menu":
   ```sql
   CREATE SCHEMA menu;
   ```
4. Copy the connection string (format: `postgresql://username:password@xxx.neon.tech/dbname?sslmode=require`)

### 3. Set Up Cloudflare R2

1. Go to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Create a new bucket for your restaurant images
4. Create an R2 API token:
   - Go to "Manage R2 API Tokens"
   - Create a new API token with read/write permissions
   - Save the Access Key ID and Secret Access Key
5. Set up public access for your bucket:
   - Go to Settings → Public Access
   - Enable public access
   - Copy the public URL (format: `https://pub-xxxxx.r2.dev`)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@xxx.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"

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

This will create all necessary tables in the "menu" schema.

### 6. Create Admin User

Run the setup script to create your admin account:

```bash
npm run setup
```

This will create an admin user with the email and password from your `.env.local` file.

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
4. Add all environment variables from your `.env.local` file
5. Update `NEXTAUTH_URL` to your production URL (e.g., `https://your-app.vercel.app`)
6. Deploy

### 3. Verify Database Connection

After deployment, verify the database schema exists:
- The app uses the "menu" schema in PostgreSQL
- All tables are automatically created via Prisma

### 4. Create Admin User in Production

If needed, run the setup script with your production database URL.

## Usage Guide

### For Restaurant Owners (Admin)

#### First Time Setup

1. **Login**: Navigate to `/admin/login` and enter your credentials
2. **Restaurant Settings**:
   - Click "Restaurant Info" in the sidebar
   - Upload your restaurant logo
   - Fill in restaurant name, description, address, phone, email
   - Click "Save Changes"

3. **Create Categories**:
   - Click "Categories" in the sidebar
   - Click "Add Category"
   - Enter category name (e.g., "Appetizers", "Main Courses", "Desserts", "Drinks")
   - Add description (optional)
   - Set display order
   - Click "Create"

4. **Add Menu Items**:
   - Click "Menu Items" in the sidebar
   - Click "Add Menu Item"
   - Upload an item image
   - Enter item name, description, and price
   - Select category
   - Set availability status
   - Click "Create"

#### Daily Operations

- **Update Availability**: Toggle items on/off without deleting them
- **Edit Prices**: Click "Edit" next to any item to update pricing
- **Reorder Categories**: Change the order number to control display sequence
- **Add Seasonal Items**: Create new items for special occasions

### For Customers (Public Menu)

1. Visit the restaurant's menu URL
2. Use the category navigation buttons to jump to specific sections
3. Scroll through the menu to browse all items
4. View item images, descriptions, and prices

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth routes
│   │   ├── categories/     # Category CRUD
│   │   ├── menu-items/     # Menu item CRUD
│   │   ├── restaurant/     # Restaurant info
│   │   └── upload/         # Image upload to R2
│   ├── admin/              # Admin panel
│   │   ├── login/         # Login page
│   │   └── dashboard/     # Admin dashboard
│   │       ├── page.tsx   # Dashboard overview
│   │       ├── layout.tsx # Admin layout with sidebar
│   │       ├── restaurant/# Restaurant settings
│   │       ├── categories/# Category management
│   │       └── menu-items/# Menu item management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Public menu page
├── components/
│   └── SessionProvider.tsx # NextAuth session wrapper
├── lib/                     # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── r2.ts              # R2 storage utilities
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   ├── manifest.json      # PWA manifest
│   └── *.png              # App icons
├── scripts/
│   └── setup.ts           # Database setup script
├── screenshots/           # Screenshots for README
└── types/
    └── next-auth.d.ts     # TypeScript definitions
```

## Database Schema

All tables are created in the `menu` schema:

### User
- Admin users for authentication
- Fields: id, email, password, name, timestamps

### Restaurant
- Restaurant information (single row)
- Fields: id, name, description, logoUrl, address, phone, email, timestamps

### Category
- Menu categories
- Fields: id, name, description, order, isActive, timestamps

### MenuItem
- Individual menu items
- Fields: id, name, description, price, imageUrl, isActive, isAvailable, order, categoryId, timestamps

## Key Features Explained

### Session Management
- Sessions last 30 days by default
- Secure HTTP-only cookies
- Automatic session refresh
- CSRF protection with sameSite cookies

### Image Upload
- Direct upload to Cloudflare R2
- Automatic URL generation
- Image optimization via Next.js Image component
- Support for common formats (JPEG, PNG, WebP)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons (minimum 44px height)
- Smooth scrolling and animations
- Hamburger menu for mobile admin panel

### Category Navigation
- Sticky navigation bar
- Smooth scroll to sections
- Horizontal scrollable on mobile
- Active category highlighting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run setup` - Create admin user

## Security Best Practices

- Never commit your `.env.local` file
- Use strong passwords for admin accounts (minimum 12 characters)
- Keep your API keys and secrets secure
- Regularly update dependencies: `npm update`
- Enable HTTPS in production (Vercel does this automatically)
- The app uses bcrypt for password hashing
- Sessions use JWT with signed tokens

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your IP is allowed in Neon's settings
- Check that SSL mode is enabled (`sslmode=require`)
- Verify the "menu" schema exists in your database

### Image Upload Issues
- Verify R2 credentials are correct
- Check bucket permissions (must allow public read)
- Ensure R2_PUBLIC_URL matches your bucket's public URL
- Verify the bucket name is correct

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set and not empty
- Check `NEXTAUTH_URL` matches your domain exactly
- Clear browser cookies and try again
- Check browser console for error messages

### Session Issues
- Clear cookies if switching between local and production
- Verify secure cookies are enabled in production
- Check that NEXTAUTH_URL uses HTTPS in production

### Menu Not Displaying
- Ensure categories and items are set to "active"
- Check that items are set to "available"
- Verify images are uploaded successfully
- Check browser network tab for API errors

## Performance Optimization

- Images are served via Cloudflare R2 CDN
- Next.js Image component provides automatic optimization
- Page revalidation every 60 seconds for fresh content
- Static generation for fast initial load
- Responsive images with proper sizing

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
- Next.js documentation: https://nextjs.org/docs
- Prisma documentation: https://www.prisma.io/docs
- Neon documentation: https://neon.tech/docs
- Cloudflare R2 documentation: https://developers.cloudflare.com/r2/
- NextAuth.js documentation: https://next-auth.js.org/

## License

MIT

---

Built with Next.js, PostgreSQL, Prisma, and Cloudflare R2

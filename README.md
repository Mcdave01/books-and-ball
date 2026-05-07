# Books & Ball Basketball Academy

A modern, production-ready web application for a basketball academy built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Public Website**: Home, About, Events, Players, News, Contact pages
- **Authentication**: Supabase Auth with role-based access (admin, coach, player, staff)
- **Admin Dashboard**: Manage events, players, and news
- **Database**: Supabase with Row Level Security (RLS)
- **Security**: Input validation, file upload restrictions, secure API routes
- **UI/UX**: Responsive design with modern sports-themed styling

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 2. Clone and Install

```bash
git clone <repository-url>
cd basketball-academy
npm install
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your service role key (keep this secret!)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Database Schema

Run the SQL in `supabase-schema.sql` in your Supabase SQL editor to create tables and RLS policies.

### 6. Storage Setup (Optional)

1. Create a storage bucket called `images` in Supabase
2. Configure storage policies for image uploads

### 7. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app
  /(public)          # Public pages
    page.tsx         # Home page
    about/page.tsx
    events/[id]/page.tsx
    players/[id]/page.tsx
    news/[id]/page.tsx
    contact/page.tsx

  /(dashboard)       # Protected admin pages
    dashboard/page.tsx
    dashboard/events/page.tsx
    dashboard/players/page.tsx
    dashboard/news/page.tsx

/components
  ui/                # Reusable UI components
  cards/             # Card components
  forms/             # Form components
  layout/            # Layout components

/lib
  supabase/          # Supabase client setup
  validations/       # Zod schemas
  utils/             # Utility functions

/types               # TypeScript type definitions
/hooks               # Custom React hooks
/services            # API service functions
```

## Authentication

The app uses Supabase Auth with the following roles:
- **admin**: Full access to all features
- **coach**: Can manage events and news
- **player**: Basic access
- **staff**: Limited access

## Security Features

- Row Level Security (RLS) on all database tables
- Input validation with Zod
- File upload restrictions (images only, size limits)
- Protected routes with middleware
- Secure API routes for sensitive operations

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

Ensure your deployment platform supports Next.js 14 and add the environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

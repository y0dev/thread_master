# ThreadMaster - Embroidery Digitization SaaS

ThreadMaster is an open-source SaaS application that converts artwork files (PNG, JPG, SVG) into machine-ready embroidery files (DST, PES, JEF, EXP, VP3). Built with Next.js, TypeScript, Supabase, and Stripe.

## 🚀 Features

- **User Authentication**: Secure signup/signin with Supabase Auth
- **File Upload**: Drag & drop interface for PNG, JPG, and SVG files
- **Background Processing**: Queue-based job processing with status tracking
- **Multiple Formats**: Support for DST, PES, JEF, EXP, and VP3 output formats
- **Subscription Plans**: Free, Basic, and Pro tiers with different limits
- **Admin Panel**: Comprehensive dashboard for system management
- **Real-time Updates**: Live job status updates and notifications
- **Responsive Design**: Modern UI that works on all devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   Supabase      │    │   Worker        │
│   (Frontend)   │◄──►│   (Auth + DB)   │◄──►│   Service       │
│                 │    │                 │    │   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Stripe        │    │   Supabase      │    │   Ink/Stitch    │
│   (Billing)     │    │   Storage       │    │   (Digitization)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **UI Components**: Radix UI, Lucide Icons
- **Worker Service**: Python + Ink/Stitch or libembroidery

## 📁 Project Structure

```
thread-master/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── upload/            # File upload page
│   │   ├── pricing/           # Pricing page
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── navigation.tsx    # Navigation bar
│   │   └── auth-provider.tsx # Auth context
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility libraries
│   └── types/                # TypeScript types
├── supabase/                 # Database schema
├── public/                   # Static assets
└── env.example              # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/y0dev/thread_master.git
cd thread_master
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Fill in the required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Create a storage bucket called `embroidery-files`
4. Set up Row Level Security (RLS) policies

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Users Table
- User profiles with subscription information
- Job usage tracking
- Stripe customer integration

### Jobs Table
- File upload tracking
- Processing status
- Output file management
- Priority handling

### Subscriptions Table
- Stripe subscription data
- Billing period tracking
- Plan management

### File Uploads Table
- File metadata storage
- User file associations

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Run the schema SQL in the SQL editor
4. Create storage buckets for file uploads
5. Configure RLS policies

### Stripe Setup

1. Create a Stripe account
2. Get your publishable and secret keys
3. Create products and price IDs for your subscription plans
4. Set up webhook endpoints

### Storage Configuration

The app uses Supabase Storage for file management:

- `embroidery-files` bucket for user uploads and processed files
- Automatic file organization by user ID
- Secure file access with RLS policies

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Self-Hosting

1. Build the application: `npm run build`
2. Set up a PostgreSQL database
3. Configure environment variables
4. Run with a process manager like PM2

### Docker Deployment

```bash
# Build the image
docker build -t thread-master .

# Run the container
docker run -p 3000:3000 --env-file .env.local thread-master
```

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- JWT-based authentication
- File access controls
- API rate limiting
- Secure file uploads

## 📊 Monitoring & Analytics

- Real-time job status tracking
- User activity monitoring
- System performance metrics
- Error logging and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs.threadmaster.com](https://docs.threadmaster.com)
- Issues: [GitHub Issues](https://github.com/yourusername/thread-master/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/thread-master/discussions)

## 🗺️ Roadmap

- [ ] Advanced embroidery optimization algorithms
- [ ] Bulk processing capabilities
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Enterprise features

## 🙏 Acknowledgments

- [Ink/Stitch](https://inkstitch.org/) - Embroidery digitization library
- [Supabase](https://supabase.com/) - Backend as a service
- [Stripe](https://stripe.com/) - Payment processing
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

Built with ❤️ by the ThreadMaster team

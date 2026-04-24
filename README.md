# ACEP Platform - Consolidated Energy & Extractive Sector Platform

A modern, world-class web platform consolidating all ACEP (Africa Centre for Energy Policy) platforms into a unified experience.

## 🌟 Features

### Integrated Platforms
- **Main ACEP Site**: Central hub for publications, news, events, and programs
- **Contract Monitor**: Track 15 petroleum contract areas with detailed information
- **Electricity Monitor**: Real-time power sector data and public complaints system
- **Oil Revenue Tracker**: Interactive dashboard tracking $9.48B in oil revenue
- **OilMoneyTV**: Video library with 100+ documentaries on oil-funded projects

### Technical Features
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with ACEP brand colors
- ✅ Mobile-first responsive design
- ✅ Docker support for local development
- ✅ Optimized for Render deployment
- ✅ SEO optimized
- ✅ Accessible (WCAG 2.1)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- npm or yarn
- Docker (optional, for containerized development)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/wastwagon/ACEP.git
cd ACEP
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) in your browser.

## 🐳 Docker Development

### Using Docker Compose (hot reload)

```bash
# Dev server in Docker with live reload (no rebuild per code change)
npm run docker:dev

# Optional: add PostgreSQL
npm run docker:dev:db

# Production-like image (standalone build)
npm run docker:prod
```

### Using Docker directly

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

The application will be available at [http://localhost:3100](http://localhost:3100)

## 📁 Project Structure

```
ACEP/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── contracts/          # Contract Monitor
│   │   ├── electricity/        # Electricity Monitor
│   │   ├── oil-revenue/        # Oil Revenue Tracker
│   │   ├── videos/             # OilMoneyTV
│   │   ├── resources/          # Publications, News, etc.
│   │   ├── about/              # About pages
│   │   ├── events/             # Events
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # Home page sections
│   │   ├── contracts/          # Contract Monitor components
│   │   ├── electricity/        # Electricity Monitor components
│   │   ├── oil-revenue/        # Oil Revenue components
│   │   └── videos/             # Video components
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
└── package.json
```

## 🎨 Design System

### ACEP Brand Colors

```css
Primary (Deep Blue): #1e3a8a
Secondary (Amber/Gold): #f59e0b
Accent (Green): #10b981
Dark: #0f172a
Light: #f1f5f9
```

### Typography
- Font: Inter (Google Fonts)
- Responsive sizing with mobile-first approach

## 📱 Mobile-First Design

All components are designed mobile-first with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

## 🚢 Deployment

### Deploy to Render

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Web Service on Render**
   - Connect your GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables: (see .env.example)

3. **Add PostgreSQL Database** (Phase 2)
   - Create PostgreSQL database in Render
   - Copy connection string to `DATABASE_URL`

4. **Custom Domain**
   - Add `acep.africa` in Render dashboard
   - Update DNS records as instructed

### Environment Variables

Create a `.env.local` file for local development:

```env
# Database (Phase 2)
DATABASE_URL=postgresql://...

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3100
```

## 📝 Development Phases

### Phase 1: Frontend Foundation ✅
- [x] Next.js setup with TypeScript
- [x] Design system and ACEP branding
- [x] Main ACEP landing page
- [ ] Contract Monitor pages
- [ ] Electricity Monitor pages
- [ ] Oil Revenue dashboard
- [ ] OilMoneyTV platform

### Phase 2: Data Layer (Upcoming)
- [ ] PostgreSQL database setup
- [ ] Prisma ORM integration
- [ ] API routes
- [ ] Content management system

### Phase 3: Backend Features (Upcoming)
- [ ] User authentication
- [ ] Complaints system
- [ ] File uploads
- [ ] Search functionality

### Phase 4: Optimization (Upcoming)
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Analytics integration
- [ ] Testing

## 🛠 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

npm run docker:dev   # Dev in Docker (hot reload)
npm run docker:dev:db # Dev + PostgreSQL
npm run docker:prod  # Production-like Compose build
npm run docker:build # Build production image
npm run docker:run   # Run production image
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

© 2026 Africa Centre for Energy Policy. All Rights Reserved.

## 📞 Contact

**Africa Centre for Energy Policy (ACEP)**
- Address: Avenue D, Hse. No. 119 D, North Legon
- Digital Address: GM-048-5151
- Phone: (+233) 302 900 730
- Email: info@acep.africa
- Website: [acep.africa](https://acep.africa)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspiration from [IEA](https://www.iea.org/)

---

Built with ❤️ by OceanCyber - IT Solutions Provider

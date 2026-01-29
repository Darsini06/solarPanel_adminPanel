# Thermal Solar Panel Project - Setup Guide

## Project Overview

This is a Next.js-based web application for managing thermal solar panel systems. The project includes user authentication, data upload capabilities, and a responsive interface built with Tailwind CSS and Framer Motion.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code or similar

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd thermalSolarPanel_Project
```

### 2. Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

---

## Environment Setup

### 1. Create Environment Variables File

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
touch .env.local
```

### 2. Add Required Environment Variables

Add the following variables to `.env.local`:

```env
# Google OAuth Configuration (if using Google authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication
NEXT_PUBLIC_AUTH_REDIRECT_URI=http://localhost:3000/login
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.jsx                 # Home page
│   │   ├── layout.jsx               # App layout
│   │   ├── globals.css              # Global styles
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/           # Login API route
│   │   │   │   └── register/        # Registration API route
│   │   │   └── upload/              # File upload API route
│   │   ├── about/                   # About page
│   │   ├── contact/                 # Contact page
│   │   ├── login/                   # Login page
│   │   ├── register/                # Registration page
│   │   └── upload/                  # Upload page
│   └── components/
│       ├── Navbar.jsx               # Navigation component
│       └── Footer.jsx               # Footer component
├── public/                          # Static assets
├── package.json                     # Dependencies
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── eslint.config.mjs                # ESLint configuration
```

---

## Available Scripts

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Start Production Server

Run the production build:

```bash
npm start
```

### Lint Code

Check code quality with ESLint:

```bash
npm run lint
```

---

## Key Dependencies

### Frontend Framework & UI
- **next** (14.2.5) - React framework for production
- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - DOM rendering
- **framer-motion** (12.29.2) - Animation library
- **tailwindcss** (3.4.17) - Utility-first CSS framework
- **lucide-react** (0.563.0) - Icon library

### API & Data
- **axios** (1.13.3) - HTTP client
- **@tanstack/react-query** (5.90.20) - Data fetching and caching

### Authentication
- **@react-oauth/google** (0.13.4) - Google OAuth integration
- **googleapis** (170.1.0) - Google API client

### Utilities
- **clsx** (2.1.1) - Utility for constructing classNames
- **tailwind-merge** (3.4.0) - Tailwind CSS class conflict resolution
- **formidable** (3.5.4) - File upload handling

---

## Features

### Current Features
- ✅ User Authentication (Login/Register)
- ✅ Google OAuth Integration
- ✅ File Upload Functionality
- ✅ Responsive Design
- ✅ Modern UI with Animations
- ✅ Contact Form
- ✅ User Profile Management

### Pages
- **Home** (`/`) - Landing page
- **About** (`/about`) - About section
- **Contact** (`/contact`) - Contact form
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration
- **Upload** (`/upload`) - File upload interface

---

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### File Upload
- `POST /api/upload` - Handle file uploads

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Make Changes

Edit files in the `src/` directory. The development server will automatically refresh.

### 3. Test Changes

Open `http://localhost:3000` in your browser and test the changes.

### 4. Commit Changes

```bash
git add .
git commit -m "Your commit message"
git push origin your-branch-name
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your repository
5. Configure environment variables
6. Click "Deploy"

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Docker containers
- Traditional Node.js servers

---

## Troubleshooting

### Issue: Port 3000 Already in Use

**Solution:**
```bash
npm run dev -- -p 3001
```

### Issue: Dependencies Not Installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Issue: Build Fails

**Solution:**
```bash
# Clear Next.js cache
rm -r .next

# Rebuild
npm run build
```

---

## Best Practices

1. **Environment Variables**: Never commit `.env.local` - use `.env.example` for reference
2. **Code Style**: Run `npm run lint` before committing
3. **Component Structure**: Keep components small and reusable
4. **Performance**: Use Next.js Image component for images
5. **Security**: Always validate and sanitize user inputs
6. **Git Workflow**: Use feature branches and pull requests

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## Project Status

- **Version**: 0.1.0
- **Node Version**: v18+
- **Last Updated**: January 2026

---

## Git Workflow

### Clone and Setup Branch

```bash
git clone <repository-url>
cd thermalSolarPanel_Project
git checkout -b feature/your-feature-name
```

### Push Changes

```bash
git add .
git commit -m "Add: Your feature description"
git push -u origin feature/your-feature-name
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start development server
4. ✅ Explore the codebase
5. ✅ Begin development
6. ✅ Test thoroughly
7. ✅ Deploy to production

---

For questions or issues, please refer to the troubleshooting section or check the project's issue tracker.

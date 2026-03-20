# Link Exchange Badges - Next.js 14 Example

This is a complete Next.js 14 application demonstrating the integration of Link Exchange Badges using the App Router pattern.

## Features

- **Next.js 14** with App Router
- **TypeScript** support
- **Client-side badge rendering** with LinkExchange component
- **Environment-based configuration**
- **Semantic HTML** with footer element

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create environment configuration:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with your badge source URL:
   ```env
   NEXT_PUBLIC_BADGES_SOURCE=https://your-badges-source.com/api/badges
   ```

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
examples/nextjs/
├── app/
│   ├── components/
│   │   └── Footer.tsx       # Client component with LinkExchange
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
└── .env.local.example        # Environment variables template
```

## Configuration

The Footer component uses the following environment variables:

- `NEXT_PUBLIC_BADGES_SOURCE` - Your badge delivery source URL (required)
- `NODE_ENV` - Environment (development/production) - automatically set

## Footer Component

The Footer component (`app/components/Footer.tsx`) demonstrates:

- `'use client'` directive for client-side rendering
- Integration with `@link-exchange/react` package
- Configuration via environment variables
- Semantic HTML using `as="footer"` prop
- Cache, security, and telemetry options
- Graceful fallback when source is not configured

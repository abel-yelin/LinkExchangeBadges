# Link Exchange React Vite Example

This is a complete example demonstrating how to use the `@link-exchange/react` package in a React + Vite application.

## Project Structure

```
react-vite-example/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node files
├── vite.config.ts          # Vite configuration
└── src/
    ├── main.tsx            # React entry point with createRoot
    ├── App.tsx             # Main app component with basic LinkExchange usage
    ├── Footer.tsx          # Footer component with full LinkExchange configuration
    ├── vite-env.d.ts       # Vite type declarations
    ├── index.css           # Global styles
    ├── App.css             # App component styles
    └── Footer.css          # Footer component styles
```

## Features Demonstrated

### Basic Usage (App.tsx)
- Minimal LinkExchange configuration
- Required `source` prop
- Optional `siteId` prop

### Advanced Usage (Footer.tsx)
- Semantic HTML with `as="footer"`
- All configuration options:
  - `source`: Remote badges.json URL
  - `siteId`: Site identifier for rule matching
  - `environment`: Environment (development/staging/production)
  - `locale`: Locale string (e.g., 'en', 'zh-CN')
  - `className`: Custom CSS class
  - `cache`: Cache configuration with TTL
  - `security`: Domain whitelist for links and images
  - `telemetry`: Event tracking callback
  - `fetchTimeoutMs`: Request timeout

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start dev server (runs on port 3000)
pnpm dev
```

### Build

```bash
# Build for production
pnpm build
```

### Preview

```bash
# Preview production build
pnpm preview
```

## Configuration

### Update Badges Source

Replace `https://example.com/badges.json` with your actual badges.json URL in:

1. `src/App.tsx` - Basic example
2. `src/Footer.tsx` - Advanced example

### Security Configuration

In `src/Footer.tsx`, update the security whitelist:

```typescript
security={{
  allowedLinkDomains: ['your-domain.com', 'trusted-partner.com'],
  allowedImageDomains: ['cdn.your-domain.com'],
}}
```

### Telemetry

The example includes a telemetry callback that logs events to the console. Integrate with your analytics service:

```typescript
telemetry={{
  enabled: true,
  onEvent: (event) => {
    // Send to your analytics (Segment, Amplitude, etc.)
    analytics.track(event.type, event)
  },
}}
```

## Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **@link-exchange/react**: workspace:* (monorepo local package)
- **vite**: ^5.0.0
- **@vitejs/plugin-react**: ^4.2.0
- **typescript**: ^5.0.0

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Link Exchange Core Documentation](../../packages/core/README.md)

import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Link Exchange Badges
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Next.js 14 App Router Example
          </p>

          <section className="prose prose-slate">
            <h2>About This Example</h2>
            <p>
              This is a complete Next.js 14 application demonstrating the integration
              of Link Exchange Badges using the App Router pattern.
            </p>

            <h2>Features</h2>
            <ul>
              <li>Next.js 14 with App Router</li>
              <li>TypeScript support</li>
              <li>Client-side badge rendering with LinkExchange component</li>
              <li>Environment-based configuration</li>
              <li>Semantic HTML with footer element</li>
            </ul>

            <h2>Setup</h2>
            <ol>
              <li>Install dependencies: <code>pnpm install</code></li>
              <li>Create a <code>.env.local</code> file with your badge source URL</li>
              <li>Run the dev server: <code>pnpm dev</code></li>
            </ol>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

import { LinkExchange } from '@link-exchange/react'
import Footer from './Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Link Exchange React Vite Example</h1>
        <p>Demonstrating the Link Exchange Badge component in a React Vite app</p>
      </header>

      <main className="app-main">
        <section className="example-section">
          <h2>Basic Example</h2>
          <p>
            Simple LinkExchange component with minimal configuration:
          </p>
          <div className="example-container">
            <LinkExchange
              source="https://example.com/badges.json"
              siteId="react-vite-example"
            />
          </div>
        </section>

        <section className="example-section">
          <h2>Footer Component Example</h2>
          <p>
            Using the Footer component with full configuration options:
          </p>
          <div className="example-container">
            <Footer />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

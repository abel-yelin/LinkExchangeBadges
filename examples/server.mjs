/**
 * 本地测试服务器
 * 用于在开发环境提供测试用的 badges.json 配置文件
 *
 * 运行: node examples/server.mjs
 * 访问: http://localhost:8080/test-badges.json
 */

import { createServer } from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 8080

const server = createServer((req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // 处理 /test-badges.json 请求
  if (req.url === '/test-badges.json' || req.url === '/badges.json') {
    try {
      const configPath = join(__dirname, 'test-badges.json')
      const content = readFileSync(configPath, 'utf-8')

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
      res.end(content)
      console.log(`✅ Served: ${req.url}`)
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
      console.error(`❌ Error serving ${req.url}:`, error.message)
    }
  } else {
    // 其他路径返回 404
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    console.log(`⚠️  Not found: ${req.url}`)
  }
})

server.listen(PORT, () => {
  console.log('\n🚀 本地测试服务器已启动!')
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`\n📋 可用的端点:`)
  console.log(`   - http://localhost:${PORT}/test-badges.json`)
  console.log(`   - http://localhost:${PORT}/badges.json`)
  console.log(`\n💡 在示例中使用以下 URL:`)
  console.log(`   source: 'http://localhost:${PORT}/test-badges.json'`)
  console.log(`\n按 Ctrl+C 停止服务器\n`)
})

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 服务器已停止')
  process.exit(0)
})

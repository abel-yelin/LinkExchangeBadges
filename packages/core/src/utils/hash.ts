/**
 * djb2 hash — 将任意字符串映射为 8 位十六进制字符串。
 * 无外部依赖，Browser + Node + Edge Runtime 均可运行。
 *
 * 示例：hash('https://cdn.example.com/badges.json') → 'a3f2b1c9'
 */
export function hash(str: string): string {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h = h >>> 0 // 保持为 32 位无符号整数
  }
  return h.toString(16).padStart(8, '0')
}

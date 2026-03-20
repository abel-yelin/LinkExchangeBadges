import { BadgeConfigSchema, type BadgeConfig } from '../types'
import { ConfigValidationError } from '../errors'
import { SUPPORTED_SCHEMA_VERSIONS } from '../constants'

/**
 * 对 fetchConfig 返回的 unknown 数据进行 zod schema 校验。
 *
 * 校验内容（自动由 zod schema 覆盖）：
 *   - 顶层字段完整性
 *   - schemaVersion 是否在 SDK 支持范围内
 *   - badges 是否为数组
 *   - 每个 badge 的 id、renderType、imageUrl（必须是合法 URL）、linkUrl 等
 *   - width / height 为正数
 *   - target 在允许集合内
 *
 * 返回规范化后的 BadgeConfig（zod 已自动填充 default 值）。
 * 校验失败时抛出 ConfigValidationError，绝不返回半校验状态的数据。
 */
export function validateConfig(input: unknown): BadgeConfig {
  // 先检查 schemaVersion，版本不支持时给出更清晰的错误提示
  if (
    typeof input === 'object' &&
    input !== null &&
    'schemaVersion' in input &&
    !SUPPORTED_SCHEMA_VERSIONS.includes(
      (input as Record<string, unknown>).schemaVersion as string,
    )
  ) {
    throw new ConfigValidationError(
      `Unsupported schemaVersion "${
        (input as Record<string, unknown>).schemaVersion
      }". ` + `This SDK supports: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
    )
  }

  const result = BadgeConfigSchema.safeParse(input)

  if (!result.success) {
    const detail = result.error.errors
      .map((e) => `[${e.path.join('.')}] ${e.message}`)
      .join('; ')
    throw new ConfigValidationError(detail)
  }

  // 校验 badge id 唯一性（zod 不原生支持 unique 数组检查）
  const ids = result.data.badges.map((b) => b.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (duplicates.length > 0) {
    throw new ConfigValidationError(
      `Duplicate badge id(s): ${duplicates.join(', ')}`,
    )
  }

  return result.data
}

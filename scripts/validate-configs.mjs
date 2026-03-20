#!/usr/bin/env node

/**
 * Link Exchange SDK - 配置文件验证脚本
 *
 * 用法: node scripts/validate-configs.mjs
 *
 * 验证 configs/examples/ 目录下的所有 JSON 配置文件
 */

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const CONFIGS_DIR = 'configs/examples'

// JSON Schema 定义
const badgeConfigSchema = {
  type: 'object',
  required: ['configVersion', 'schemaVersion', 'updatedAt', 'badges'],
  properties: {
    configVersion: { type: 'string', minLength: 1 },
    schemaVersion: { type: 'string', enum: ['1.0.0'] },
    updatedAt: { type: 'string', format: 'date-time' },
    badges: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'enabled', 'renderType', 'imageUrl', 'linkUrl'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          enabled: { type: 'boolean' },
          group: { type: 'string' },
          priority: { type: 'number' },
          renderType: { type: 'string', enum: ['image'] },
          imageUrl: { type: 'string', format: 'uri' },
          linkUrl: { type: 'string', format: 'uri' },
          alt: { type: 'string' },
          target: { type: 'string', enum: ['_self', '_blank'] },
          rel: { type: 'string' },
          width: { type: 'number', minimum: 1 },
          height: { type: 'number', minimum: 1 },
          rules: {
            type: 'object',
            properties: {
              siteIds: { type: 'array', items: { type: 'string' } },
              environments: { type: 'array', items: { type: 'string', enum: ['development', 'staging', 'production'] } },
              locales: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }
  }
}

// 简单的 JSON Schema 验证器
function validateSchema(data, schema, path = '') {
  const errors = []

  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`${path}${path ? '.' : ''}${field} is required`)
      }
    }
  }

  for (const [key, propSchema] of Object.entries(schema.properties || {})) {
    if (!(key in data)) continue

    const value = data[key]
    const fieldPath = `${path}${path ? '.' : ''}${key}`

    // Type validation
    if (propSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`${fieldPath} must be string`)
    }
    if (propSchema.type === 'number' && typeof value !== 'number') {
      errors.push(`${fieldPath} must be number`)
    }
    if (propSchema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${fieldPath} must be boolean`)
    }
    if (propSchema.type === 'array' && !Array.isArray(value)) {
      errors.push(`${fieldPath} must be array`)
    }

    // String validations
    if (typeof value === 'string') {
      if (propSchema.minLength && value.length < propSchema.minLength) {
        errors.push(`${fieldPath} minimum length is ${propSchema.minLength}`)
      }
      if (propSchema.enum && !propSchema.enum.includes(value)) {
        errors.push(`${fieldPath} must be one of: ${propSchema.enum.join(', ')}`)
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (propSchema.minimum && value < propSchema.minimum) {
        errors.push(`${fieldPath} minimum is ${propSchema.minimum}`)
      }
    }

    // Array item validation
    if (Array.isArray(value) && propSchema.items) {
      value.forEach((item, index) => {
        const itemErrors = validateSchema(item, propSchema.items, `${fieldPath}[${index}]`)
        errors.push(...itemErrors)
      })
    }

    // Nested object validation
    if (propSchema.type === 'object' && typeof value === 'object' && value !== null) {
      const nestedErrors = validateSchema(value, propSchema, fieldPath)
      errors.push(...nestedErrors)
    }
  }

  return errors
}

// 验证单个配置文件
function validateConfigFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const config = JSON.parse(content)

    // Schema 验证
    const schemaErrors = validateSchema(config, badgeConfigSchema)

    // 验证 badge ID 唯一性
    const badgeIds = config.badges?.map((b) => b.id) || []
    const uniqueIds = new Set(badgeIds)
    if (badgeIds.length !== uniqueIds.size) {
      const duplicates = badgeIds.filter((id, i) => badgeIds.indexOf(id) !== i)
      schemaErrors.push(`Duplicate badge IDs found: ${[...new Set(duplicates)].join(', ')}`)
    }

    return {
      file: filePath,
      valid: schemaErrors.length === 0,
      errors: schemaErrors
    }
  } catch (error) {
    return {
      file: filePath,
      valid: false,
      errors: [error.message]
    }
  }
}

// 主函数
function main() {
  console.log('🔍 Validating badge config files...\n')

  let hasErrors = false

  try {
    const files = readdirSync(CONFIGS_DIR).filter((f) => f.endsWith('.json'))

    if (files.length === 0) {
      console.log('⚠️  No config files found in configs/examples/')
      process.exit(0)
    }

    for (const file of files) {
      const filePath = join(CONFIGS_DIR, file)
      const result = validateConfigFile(filePath)

      if (result.valid) {
        console.log(`✅ ${file}`)
      } else {
        console.log(`❌ ${file}`)
        result.errors.forEach((err) => console.log(`   - ${err}`))
        hasErrors = true
      }
    }
  } catch (error) {
    console.error(`❌ Error reading configs directory: ${error.message}`)
    process.exit(1)
  }

  console.log()
  if (hasErrors) {
    console.log('❌ Validation failed!')
    process.exit(1)
  } else {
    console.log('✅ All configs are valid!')
    process.exit(0)
  }
}

main()

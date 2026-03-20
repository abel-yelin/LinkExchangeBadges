import { describe, it, expect } from 'vitest'
import { validateConfig } from '../validateConfig'
import { ConfigValidationError } from '../../errors'

const validInput = {
  configVersion: '1',
  schemaVersion: '1.0.0' as const,
  updatedAt: '2026-01-01T00:00:00Z',
  badges: [
    {
      id: 'ph',
      name: 'Product Hunt',
      enabled: true,
      renderType: 'image' as const,
      imageUrl: 'https://producthunt.com/img.svg',
      linkUrl: 'https://producthunt.com',
    },
  ],
}

describe('validateConfig', () => {
  it('合法配置通过校验', () => {
    expect(() => validateConfig(validInput)).not.toThrow()
  })

  it('不支持的 schemaVersion 抛出错误', () => {
    expect(() =>
      validateConfig({ ...validInput, schemaVersion: '99.0.0' as const }),
    ).toThrow(ConfigValidationError)
  })

  it('imageUrl 不合法时抛出错误', () => {
    expect(() =>
      validateConfig({
        ...validInput,
        badges: [{ ...validInput.badges[0], imageUrl: 'not-a-url' }],
      }),
    ).toThrow(ConfigValidationError)
  })

  it('重复 id 时抛出错误', () => {
    expect(() =>
      validateConfig({
        ...validInput,
        badges: [validInput.badges[0], { ...validInput.badges[0] }],
      }),
    ).toThrow(ConfigValidationError)
  })
})

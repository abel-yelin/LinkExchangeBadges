export class SDKError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SDKError'
  }
}

export class TargetNotFoundError extends SDKError {
  constructor(selector: string) {
    super(`[LinkExchange] Target element not found: "${selector}"`)
    this.name = 'TargetNotFoundError'
  }
}

export class ConfigFetchError extends SDKError {
  constructor(source: string, cause: string) {
    super(`[LinkExchange] Failed to fetch config from "${source}": ${cause}`)
    this.name = 'ConfigFetchError'
  }
}

export class ConfigValidationError extends SDKError {
  constructor(detail: string) {
    super(`[LinkExchange] Config validation failed: ${detail}`)
    this.name = 'ConfigValidationError'
  }
}

export class RenderError extends SDKError {
  constructor(cause: string) {
    super(`[LinkExchange] Render failed: ${cause}`)
    this.name = 'RenderError'
  }
}

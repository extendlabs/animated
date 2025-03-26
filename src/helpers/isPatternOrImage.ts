export function isPatternOrImage(background: string): boolean {
    return background.includes("url(")
  }
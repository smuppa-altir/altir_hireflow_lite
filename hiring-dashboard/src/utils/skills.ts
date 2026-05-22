const MAX_SKILL_LENGTH = 80
const MAX_SKILL_COUNT = 50

/** Parse comma- or semicolon-separated skills from a form field */
export function parseSkillsInput(value: string): string[] {
  return sanitizeSkills(
    value.split(/[,;]/).map((part) => part.trim()).filter(Boolean),
  )
}

export function formatSkillsInput(skills: string[]): string {
  return sanitizeSkills(skills).join(', ')
}

/** Normalize, dedupe, and cap skills before API calls */
export function sanitizeSkills(skills: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of skills) {
    const skill = raw.trim().slice(0, MAX_SKILL_LENGTH)
    if (!skill) continue
    if (skill.split(/\s+/).length > 6) continue
    const key = skill.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(skill)
    if (result.length >= MAX_SKILL_COUNT) break
  }
  return result
}

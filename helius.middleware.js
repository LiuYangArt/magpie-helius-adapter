// Normalize the non-standard action value observed in Codex Responses input.
// Scope the rewrite to the Helius provider so other providers are untouched.
export function onProvider(body, ctx) {
  if (ctx.provider?.id !== "helius") return body
  if (ctx.protocol !== "responses" || !body || !Array.isArray(body.input)) return body

  for (const item of body.input) {
    if (!item || typeof item !== "object") continue
    const action = item.action
    if (!action || typeof action !== "object") continue
    if (action.type === "other") action.type = "search"
  }
  return body
}

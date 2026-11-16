import { existsSync, readFileSync } from "node:fs"
import { expect, test } from "vitest"

test.each(["review", "triage", "rebase"])(
  "%s workflow checks out trusted code before using local actions",
  (action) => {
    const workflow = readFileSync(
      new URL(`../.github/workflows/${action}.yml`, import.meta.url),
      "utf8",
    )
    const checkoutStart = workflow.indexOf("      - uses: actions/checkout@")
    expect(checkoutStart).toBeGreaterThan(0)
    const checkout = workflow.slice(checkoutStart, workflow.indexOf("\n\n", checkoutStart))
    expect(checkout).toContain(`          ref: \${{ github.sha }}\n`)
    expect(checkout).toContain("          persist-credentials: false")
    expect(workflow).toMatch(/^ {2}contents: (read|write)$/m)
    expect(workflow).not.toContain("github.event.pull_request.head")
    expect(workflow).not.toContain("narumiruna/pi-actions/")

    const localActions = [...workflow.matchAll(/^\s+(?:- )?uses: (\.\/\S+)$/gm)]
    expect(localActions.map((match) => match[1])).toEqual(
      action === "rebase" ? ["./rebase"] : [`./${action}`, "./persist-auth"],
    )
    for (const match of localActions) {
      expect(match.index).toBeGreaterThan(checkoutStart + checkout.length)
      expect(existsSync(new URL(`../${match[1]}/action.yml`, import.meta.url))).toBe(true)
    }
  },
)

import { readFileSync } from "node:fs"
import { expect, test } from "vitest"

const workflow = readFileSync(new URL("../.github/workflows/review.yml", import.meta.url), "utf8")

test("uses the local repository review action", () => {
  expect(workflow).toMatch(/^\s+uses: \.\/review\s*$/m)
})

test("keeps automatic reviews on the trusted pull_request_target event", () => {
  expect(workflow).toContain("\n  pull_request_target:")
  expect(workflow).not.toContain("\n  pull_request:")
})

test("does not check out or select the pull request head as action code", () => {
  expect(workflow).not.toContain("github.event.pull_request.head")
})

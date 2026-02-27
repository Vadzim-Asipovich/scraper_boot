import { expect, test } from 'vitest'
import { normalizeURL } from "./crawl";

const expectedOutput = 'www.boot.dev/blog/path'
test('https and trailing slash are removed', () => {
    expect(normalizeURL('https://www.boot.dev/blog/path/'))
    .toBe(expectedOutput)
})
test('normalized string as input doesnt change', () => {
    expect(normalizeURL(expectedOutput))
    .toBe(expectedOutput)
})
import { expect, test } from 'vitest'
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML } from "./crawl";

const expectedOutput = 'www.boot.dev/blog/path'
test('normalizeURL: https and trailing slash are removed', () => {
    expect(normalizeURL('https://www.boot.dev/blog/path/'))
    .toBe(expectedOutput)
})
test('normalizeURL: normalized string as input doesnt change', () => {
    expect(normalizeURL(expectedOutput))
    .toBe(expectedOutput)
})
test('getHeadingFromHTML: returns h1 from HTML', () => {
    expect(getHeadingFromHTML(`<html><body>
      <h1>Outside paragraph.</h1>
      <main>
        <h2>Main paragraph.</h2>
      </main>
    </body></html>`))
    .toBe(`Outside paragraph.`)
})

test('getHeadingFromHTML: returns h2 from HTML if h1 is not present', () => {
    expect(getHeadingFromHTML(`<html><body>
      <h2>Main paragraph.</h2>
      <main>
        <h3>Sub paragraph.</h3>
      </main>
    </body></html>`))
    .toBe(`Main paragraph.`)
})

test('getHeadingFromHTML: returns empty string if no headings are present', () => {
    expect(getHeadingFromHTML(`<html><body>
      <p>Main paragraph.</p>
      <main>
        <p>Sub paragraph.</p>
      </main>
    </body></html>`))
    .toBe(``)
})

test('getFirstParagraphFromHTML: returns first paragraph in <main> from HTML when present', () => {
    expect(getFirstParagraphFromHTML(`<html><body>
      <p>Main paragraph.</p>
      <main>
        <p>Sub paragraph.</p>
      </main>
    </body></html>`))
    .toBe(`Sub paragraph.`)
})

test('getFirstParagraphFromHTML: returns first paragraph in from HTML if no <main>', () => {
    expect(getFirstParagraphFromHTML(`<html><body>
        <p>Main paragraph.</p>
        <p>Sub paragraph.</p>
    </body></html>`))
    .toBe(`Main paragraph.`)
})

test('getFirstParagraphFromHTML: returns empty string if no paragraph is present', () => {
    expect(getFirstParagraphFromHTML(`<html><body>
        <h1>Main paragraph.</h1>
        <h1>Sub paragraph.</h1>
    </body></html>`))
    .toBe(``)
})

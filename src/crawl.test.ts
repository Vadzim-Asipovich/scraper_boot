import { describe, expect, test } from 'vitest'
import { 
  getFirstParagraphFromHTML, 
  getHeadingFromHTML, 
  normalizeURL, 
  getURLsFromHTML,
  getImagesFromHTML,
  extractPageData } from './crawl'

const expectedOutput = 'www.boot.dev/blog/path'

const htmlWithH1 = `<html><body>
  <h1>Outside paragraph.</h1>
  <main>
    <h2>Main paragraph.</h2>
  </main>
</body></html>`

const htmlWithH2Only = `<html><body>
  <h2>Main paragraph.</h2>
  <main>
    <h3>Sub paragraph.</h3>
  </main>
</body></html>`

const htmlWithMainParagraph = `<html><body>
  <p>Main paragraph.</p>
  <main>
    <p>Sub paragraph.</p>
  </main>
</body></html>`

const htmlWithNoMain = `<html><body>
  <p>Main paragraph.</p>
  <p>Sub paragraph.</p>
</body></html>`

const htmlWithNoParagraph = `<html><body>
  <h1>Main paragraph.</h1>
  <h1>Sub paragraph.</h1>
</body></html>`

const htmlWithRelativeURL = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`

const htmlWithRelativeImage = `<html><body><img src="/path/image.png"></body></html>`

describe('normalizeURL', () => {
  test('https and trailing slash are removed', () => {
    expect(normalizeURL('https://www.boot.dev/blog/path/')).toBe(expectedOutput)
  })

  test('normalized string as input does not change', () => {
    expect(normalizeURL(expectedOutput)).toBe(expectedOutput)
  })
})

describe('getHeadingFromHTML', () => {
  test('returns h1 from HTML', () => {
    expect(getHeadingFromHTML(htmlWithH1)).toBe('Outside paragraph.')
  })

  test('returns h2 from HTML if h1 is not present', () => {
    expect(getHeadingFromHTML(htmlWithH2Only)).toBe('Main paragraph.')
  })

  test('returns empty string if no headings are present', () => {
    expect(getHeadingFromHTML(htmlWithMainParagraph)).toBe('')
  })
})

describe('getFirstParagraphFromHTML', () => {
  test('returns first paragraph in <main> from HTML when present', () => {
    expect(getFirstParagraphFromHTML(htmlWithMainParagraph)).toBe('Sub paragraph.')
  })

  test('returns first paragraph from HTML if no <main>', () => {
    expect(getFirstParagraphFromHTML(htmlWithNoMain)).toBe('Main paragraph.')
  })

  test('returns empty string if no paragraph is present', () => {
    expect(getFirstParagraphFromHTML(htmlWithNoParagraph)).toBe('')
  })
})

describe('getURLsFromHTML', () => {
  test('relative URLs are converted to absolute URLs', () => {
    expect(getURLsFromHTML(htmlWithRelativeURL, 'https://www.boot.dev')).toEqual(['https://www.boot.dev/path/one'])
  })
  test('absolute URLs are not modified', () => {
    const htmlWithAbsoluteURL = `<html><body><a href="https://www.example.com/path/one"><span>Example</span></a></body></html>`
    expect(getURLsFromHTML(htmlWithAbsoluteURL, 'https://www.boot.dev')).toEqual(['https://www.example.com/path/one'])
  })
  test('multiple URLs are all converted correctly', () => {    const htmlWithMultipleURLs = `<html><body>
      <a href="/path/one"><span>Boot.dev</span></a>
      <a href="https://www.example.com/path/two"><span>Example</span></a>
    </body></html>`
    expect(getURLsFromHTML(htmlWithMultipleURLs, 'https://www.boot.dev')).toEqual(['https://www.boot.dev/path/one', 'https://www.example.com/path/two'])
  })

})

describe('getImagesFromHTML', () => {
  test('relative image URLs are converted to absolute URLs', () => {
    expect(getImagesFromHTML(htmlWithRelativeImage, 'https://www.boot.dev')).toEqual(['https://www.boot.dev/path/image.png'])
  })
  test('absolute image URLs are not modified', () => {
    const htmlWithAbsoluteImage = `<html><body><img src="https://www.example.com/path/image.png"></body></html>`
    expect(getImagesFromHTML(htmlWithAbsoluteImage, 'https://www.boot.dev')).toEqual(['https://www.example.com/path/image.png'])
  })
  test('multiple image URLs are all converted correctly', () => {    const htmlWithMultipleImages = `<html><body>
      <img src="/path/image1.png">
      <img src="https://www.example.com/path/image2.png">
    </body></html>`
    expect(getImagesFromHTML(htmlWithMultipleImages, 'https://www.boot.dev')).toEqual(['https://www.boot.dev/path/image1.png', 'https://www.example.com/path/image2.png'])
  })  
})

describe('extractPageData', () => {
  test('relative image URLs are converted to absolute URLs', () => {
    const expected = {
    url: "https://crawler-test.com",
    heading: "Test Title",
    firstParagraph: "This is the first paragraph.",
    outgoingLinks: ["https://crawler-test.com/link1"],
    imageURLs: ["https://crawler-test.com/image1.jpg"],
  };
    expect(extractPageData(
      `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `, 'https://crawler-test.com')).toEqual(expected)
  })
  test('handles missing elements gracefully', () => {
    const expected = {
      url: "https://crawler-test.com",
      heading: "",
      firstParagraph: "",
      outgoingLinks: [],
      imageURLs: [],
    };
    expect(extractPageData(
      `
    <html><body>
      <h1></h1>
      <p></p>
    </body></html>
  `, 'https://crawler-test.com')).toEqual(expected)
  })
})

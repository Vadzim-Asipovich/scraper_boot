import { JSDOM } from "jsdom";
import { b } from "vitest/dist/chunks/suite.d.BJWk38HB";


export function normalizeURL(input: string): string {
    const trimmed = input.trim();

    return trimmed
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "");
}

export function getHeadingFromHTML(html: string): string {
    const dom = new JSDOM(html);
    return dom.window.document.querySelector("h1")?.textContent
        || dom.window.document.querySelector("h2")?.textContent
        || "";
}

export function getFirstParagraphFromHTML(html: string): string{
    const dom = new JSDOM(html);
    return dom.window.document.querySelector("main p")?.textContent 
    || dom.window.document.querySelector("p")?.textContent || "";
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
    const dom = new JSDOM(html);
    const links = Array.from(dom.window.document.querySelectorAll("a"))
        .map(link => link.href);
    const absoluteLinks = links.map(link => {
        if (link.startsWith("http://") || link.startsWith("https://")) {
            return link;
        } else {
            return new URL(link, baseURL).href;
        }
    });
    return absoluteLinks;
}

export function getImagesFromHTML(html: string, baseURL: string): string[]{
        const dom = new JSDOM(html);
        const images = Array.from(dom.window.document.querySelectorAll("img"))
            .map(img => img.src);
        const absoluteImages = images.map(src => {
            if (src.startsWith("http://") || src.startsWith("https://")) {
                return src;
            } else {
                return new URL(src, baseURL).href;
            }
        });
        return absoluteImages;
    }
export type ExtractedPageData = {
    url: string;
    heading: string;
    firstParagraph: string;
    outgoingLinks: string[];
    imageURLs: string[];
}
export function extractPageData(html: string, pageURL: string): ExtractedPageData{
    const extractedData: ExtractedPageData = {
        url: pageURL,
        heading: getHeadingFromHTML(html),
        firstParagraph: getFirstParagraphFromHTML(html),
        outgoingLinks: getURLsFromHTML(html, pageURL),
        imageURLs: getImagesFromHTML(html, pageURL)
    }
    return extractedData;
}

export async function getHTML(url: string) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            if (response.headers.get("content-type")?.includes("text/html")) {
                return await response.text();
            } else {
                console.error(`Content at ${url} is not HTML: ${response.headers.get("content-type")}`);
                return null;
            }
        } else {
            console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
) {
    if (currentURL.includes(baseURL) === false) {
        return pages;
    }

    const normalizedURL = normalizeURL(currentURL);
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }

    pages[normalizedURL] = 1;

    try {
        const html = await getHTML(currentURL);
        if (html) {
            const nextURLs = getURLsFromHTML(html, baseURL);
            for (const nextURL of nextURLs) {
                await crawlPage(baseURL, nextURL, pages);
            }
        }
    } catch (err) {
        console.error(`Error crawling ${currentURL}:`, err);
    }

    return pages;
}
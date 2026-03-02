import { JSDOM } from "jsdom";


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
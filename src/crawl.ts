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
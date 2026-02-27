import { JSDOM } from "jsdom";


export function normalizeURL(input: string): string {
    const trimmed = input.trim();

    return trimmed
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "");
}

function getHeadingFromHTML(html: string): string {
    throw new Error("Not implemented");
}
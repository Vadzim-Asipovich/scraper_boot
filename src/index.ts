import { argv } from 'node:process';
import { crawlPage, getHTML } from './crawl';

async function main() {
  if (argv.length !== 3) {
    console.log("Usage: node index.js <url>");
    process.exit(1);
  }

  const url = argv[2];
  try {
    const pages = await crawlPage(url);
    if (pages !== null) {
      console.log(pages);
    }
  } catch (err) {
    console.error(`Error fetching pages from ${url}:`, err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
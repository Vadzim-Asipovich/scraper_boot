import { argv } from 'node:process';

function main() {
  if (argv.length !== 3) {
    console.log("Usage: node index.js <url>");
    process.exit(1);
  }

  const url = argv[2];
  console.log(`Crawling URL: ${url}`);
  process.exit(0);
}

main();
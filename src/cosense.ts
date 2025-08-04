import type { Page, PageSummery } from '@cosense/types/rest';
import { logger } from './utils/logger.js';

export function pageToText(page: Page): string {
  logger.log(page.relatedPages);
  const text = `
${page.lines.map((line) => line.text).join('\n')}

# Related Pages
## 1-hop links
${page.relatedPages.links1hop.map((page) => page.title).join('\n')}

## 2-hop links
${page.relatedPages.links2hop.map((page) => page.title).join('\n')}

## external links
${page.relatedPages.projectLinks1hop.map((page) => page.title).join('\n')}
`;
  return text;
}

export function generateDescription(page: PageSummery): string {
  return [
    `Title: ${page.title}`,
    `Description:`,
    ...page.descriptions,
    `Created: ${formatDate(page.created)}`,
    `Last Updated: ${formatDate(page.updated)}`,
    `Last Accessed: ${formatDate(page.accessed)}`,
    `Views: ${page.views}`,
    `Linked from: ${page.linked} pages`,
  ].join('\n');
}

function formatDate(unixTime: number): string {
  return new Date(unixTime * 1000).toLocaleString();
}

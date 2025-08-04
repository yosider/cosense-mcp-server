import {
  getPage as _getPage,
  listPages as _listPages,
  searchForPages as _searchForPages,
} from '@cosense/std/rest';
import type { Page, PageList, SearchResult } from '@cosense/types/rest';
import { type Result, isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
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

export async function getPage(
  projectName: string,
  title: string,
  options: { sid?: string } = {}
): Promise<Page> {
  const result = await _getPage(projectName, title, options);
  const page = unwrap(result)!;
  return page;
}

export async function listPages(
  projectName: string,
  options: { sid?: string } = {}
): Promise<PageList> {
  const result = await _listPages(projectName, options);
  const pages = unwrap(result)!;
  return pages;
}

export async function searchForPages(
  query: string,
  projectName: string,
  options: { sid?: string } = {}
): Promise<SearchResult> {
  const result = await _searchForPages(query, projectName, options);
  const searchResult = unwrap(result)!;
  return searchResult;
}

function unwrap<T>(result: Result<T, unknown>): T {
  if (isErr(result)) {
    throw unwrapErr(result);
  }
  return unwrapOk(result);
}

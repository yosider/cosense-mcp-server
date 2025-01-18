import {
  getPage as _getPage,
  listPages as _listPages,
} from '@cosense/std/rest';
import type { Page, PageList } from '@cosense/types/rest';
import { Result, isErr, unwrapErr, unwrapOk } from 'option-t/PlainResult';

export function pageToText(page: Page): string {
  const text = `
${page.title}

${page.lines.map((line) => line.text).join('\n')}
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

function unwrap<T>(result: Result<T, unknown>): T {
  if (isErr(result)) {
    throw unwrapErr(result);
  }
  return unwrapOk(result);
}

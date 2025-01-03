import { getPage as _getPage } from '@cosense/std/rest';
import type { Page } from '@cosense/types/rest';
import { isErr, unwrapErr, unwrapOk } from 'option-t/PlainResult';

export function toReadablePage(page: Page): {
  title: string;
  description: string;
} {
  const titleAndDescription = `
${page.title}
---

${page.lines.map((line) => line.text).join('\n')}
`;

  const relatedPages =
    page.links.length > 0
      ? `## 関連するページのタイトル
${page.links.join('\n')}
`
      : '';
  return {
    title: page.title,
    description: titleAndDescription + '\n' + relatedPages,
  };
}

export async function getPage(
  projectName: string,
  title: string,
  options: { sid?: string } = {}
): Promise<Page> {
  const result = await _getPage(projectName, title, options);

  if (isErr(result)) {
    throw unwrapErr(result);
  }
  return unwrapOk(result);
}

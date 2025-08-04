import { searchForPages } from '@cosense/std/rest';
import type { FoundPage, SearchResult } from '@cosense/types/rest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import type { Tool, ToolContext } from './types.js';

type SearchPagesArgs = {
  query: string;
};

export const searchPagesTool: Tool<SearchPagesArgs> = {
  name: 'search_pages',
  description:
    'Search for pages containing the specified query string in the Cosense project.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query string (space separated)',
      },
    },
    required: ['query'],
  },
  execute,
};

async function execute(
  { query }: SearchPagesArgs,
  { projectName, cosenseOptions }: ToolContext
): Promise<CallToolResult> {
  const result = await searchForPages(query, projectName, cosenseOptions);

  if (isErr(result)) {
    const error = unwrapErr(result);
    return {
      content: [
        {
          type: 'text',
          text: `Error: Failed to search pages in project "${projectName}" with query "${query}": ${error}`,
        },
      ],
      isError: true,
    };
  }

  const searchResult = unwrapOk(result);
  return {
    content: [
      {
        type: 'text',
        text: searchResultToText(searchResult),
      },
    ],
  };
}

function searchResultToText({
  searchQuery,
  count,
  pages,
}: SearchResult): string {
  const headerText = [
    `Search result for "${searchQuery}":`,
    `Found ${count} pages.`,
  ].join('\n');
  const pageText = pages.map((page) => foundPageToText(page)).join('\n\n');
  const text = [headerText, '', pageText].join('\n');
  return text;
}

function foundPageToText({ title, words, lines }: FoundPage): string {
  return [
    `Page title: ${title}`,
    `Matched words: ${words.join(', ')}`,
    `Surrounding lines:`,
    lines.join('\n'),
  ].join('\n');
}

import { searchForPages } from '@cosense/std/rest';
import type { FoundPage, SearchResult } from '@cosense/types/rest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import { z } from 'zod';
import type { Config } from '../config.js';

export function registerSearchPagesTool(server: McpServer, config: Config) {
  server.tool(
    'search_pages',
    'Search for pages containing the specified query string in the Cosense project.',
    {
      query: z.string().describe('Search query string (space separated)'),
    },
    async ({ query }) => {
      const cosenseOptions = {
        sid: config.cosenseSid,
      };

      const result = await searchForPages(query, config.projectName, cosenseOptions);

      if (isErr(result)) {
        const error = unwrapErr(result);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Failed to search pages in project "${config.projectName}" with query "${query}": ${error}`,
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
  );
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

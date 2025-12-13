import { assert, isString } from '@core/unknownutil';
import { getPage, searchForPages } from '@cosense/std/unstable-api';
import {
  ResourceTemplate,
  type McpServer,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { UriTemplate } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import type { Config } from '../config.js';
import { pageToText } from '../cosense.js';
import { sendLoggingMessage } from '../logging.js';

interface PageSuggestion {
  title: string;
}

export function registerPageResources(server: McpServer, config: Config) {
  server.registerResource(
    'cosense pages',
    new ResourceTemplate(
      new UriTemplate(`cosense://${config.projectName}/{+title}`),
      {
        list: undefined,
        complete: {
          title: async (title) => {
            // Search for pages with at least 2 characters
            if (!title || title.length < 2) {
              return [];
            }

            const res = await searchForPages(config.projectName, title, {
              sid: config.cosenseSid,
            });
            if (!res.ok)
              throw new Error(`Error: ${(await res.json()).message}`, {
                cause: res,
              });
            const { pages } = await res.json();

            return sortPagesByRelevance(pages, title);
          },
        },
      }
    ),
    {
      title: `Cosense Pages in /${config.projectName}`,
      mimeType: 'text/plain',
    },
    async (uri, { title }) => {
      assert(title, isString);
      title = decodeURIComponent(title);
      sendLoggingMessage(server.server, {
        level: 'info',
        data: { uri, title },
      });

      const res = await getPage(config.projectName, title, {
        sid: config.cosenseSid,
      });
      if (!res.ok) {
        const error = await res.json();
        sendLoggingMessage(server.server, {
          level: 'error',
          data: { error, url: res.url },
        });
        throw new Error(`Error: ${error.message}`, { cause: res });
      }
      const page = await res.json();
      sendLoggingMessage(server.server, {
        level: 'info',
        data: page.relatedPages,
      });
      return {
        contents: [
          {
            uri: uri.href,
            text: pageToText(page),
          },
        ],
      };
    }
  );
}

/**
 * Sort pages by relevance to the query.
 */
function sortPagesByRelevance(
  pages: PageSuggestion[],
  query: string
): string[] {
  const queryLower = query.toLowerCase();

  return pages
    .sort((a, b) => {
      const aTitleLower = a.title.toLowerCase();
      const bTitleLower = b.title.toLowerCase();

      // prefix match
      const aPrefix = aTitleLower.startsWith(queryLower);
      const bPrefix = bTitleLower.startsWith(queryLower);
      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;

      // substring match
      const aContains = aTitleLower.includes(queryLower);
      const bContains = bTitleLower.includes(queryLower);
      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;

      // sort by length (shorter first)
      return a.title.length - b.title.length;
    })
    .map((page) => page.title);
}

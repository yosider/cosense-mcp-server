import { getPage, searchForPages } from '@cosense/std/unstable-api';
import {
  ResourceTemplate,
  type McpServer,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { pageToText } from '../cosense.js';
import { sendLoggingMessage } from '../logging.js';
import { UriTemplate } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import { assert, isString } from '@core/unknownutil';

export function registerPageResources(server: McpServer, config: Config) {
  server.registerResource(
    'cosense pages',
    new ResourceTemplate(
      new UriTemplate(`cosense://${config.projectName}/{+title}`),
      {
        list: undefined,
        complete: {
          title: async (title) => {
            const res = await searchForPages(config.projectName, title, {
              sid: config.cosenseSid,
            });
            if (!res.ok)
              throw new Error(`Error: ${(await res.json()).message}`, {
                cause: res,
              });
            const { pages } = await res.json();
            return pages.map(({ title }) => title);
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

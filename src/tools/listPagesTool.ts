import { listPages } from '@cosense/std/rest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import type { Config } from '../config.js';
import { generateDescription } from '../cosense.js';

export function registerListPagesTool(server: McpServer, config: Config) {
  server.tool(
    'list_pages',
    'List Cosense pages in the project.',
    {},
    async () => {
      const cosenseOptions = {
        sid: config.cosenseSid,
      };

      const result = await listPages(config.projectName, cosenseOptions);

      if (isErr(result)) {
        const error = unwrapErr(result);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Failed to list pages from project "${config.projectName}": ${error}`,
            },
          ],
          isError: true,
        };
      }

      const pageList = unwrapOk(result);
      return {
        content: [
          {
            type: 'text',
            text: pageList.pages
              .map((page) => generateDescription(page))
              .join('\n-----\n'),
          },
        ],
      };
    }
  );
}

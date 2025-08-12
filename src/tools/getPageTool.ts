import { getPage } from '@cosense/std/rest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import { z } from 'zod';
import type { Config } from '../config.js';
import { pageToText } from '../cosense.js';

export function registerGetPageTool(server: McpServer, config: Config) {
  server.tool(
    'get_page',
    'Get a page with the specified title from the Cosense project.',
    {
      title: z.string().describe('Title of the page'),
    },
    async ({ title }) => {
      const cosenseOptions = {
        sid: config.cosenseSid,
      };

      const result = await getPage(config.projectName, title, cosenseOptions);

      if (isErr(result)) {
        const error = unwrapErr(result);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Failed to get page "${title}" from project "${config.projectName}": ${error}`,
            },
          ],
          isError: true,
        };
      }

      const page = unwrapOk(result);
      return {
        content: [
          {
            type: 'text',
            text: pageToText(page),
          },
        ],
      };
    }
  );
}

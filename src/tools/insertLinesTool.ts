import { patch } from '@cosense/std/websocket';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { unwrapErr } from 'option-t/plain_result';
import { z } from 'zod';
import type { Config } from '../config.js';

export function registerInsertLinesTool(server: McpServer, config: Config) {
  server.tool(
    'insert_lines',
    'Insert lines after the specified target line in a Cosense page. If the target line is not found, append to the end of the page.',
    {
      title: z.string().describe('Title of the page to modify'),
      targetLineText: z
        .string()
        .describe(
          'Text of the line after which to insert new content. If not found, content will be appended to the end.'
        ),
      text: z
        .string()
        .describe(
          'Text to insert. If you want to insert multiple lines, use \\n for line breaks.'
        ),
    },
    async ({ title, targetLineText, text }) => {
      const cosenseOptions = {
        sid: config.cosenseSid,
      };

      const result = await patch(
        config.projectName,
        title,
        (lines) => {
          // find the index of the target line
          let index = lines.findIndex((line) => line.text === targetLineText);
          // if not found, append to the end
          index = index < 0 ? lines.length : index;
          // insert the text
          const linesText = lines.map((line) => line.text);
          return [
            ...linesText.slice(0, index + 1),
            ...text.split('\n'),
            ...linesText.slice(index + 1),
          ];
        },
        cosenseOptions
      );

      if (result.ok) {
        return {
          content: [
            {
              type: 'text',
              text: `Successfully inserted lines.`,
            },
          ],
        };
      } else {
        const error = unwrapErr(result);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Failed to insert lines in page "${title}": ${error}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

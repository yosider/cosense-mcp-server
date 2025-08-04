import { listPages } from '@cosense/std/rest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import { generateDescription } from '../cosense.js';
import type { Tool, ToolContext } from './types.js';

type ListPagesArgs = Record<string, never>;

export const listPagesTool: Tool<ListPagesArgs> = {
  name: 'list_pages',
  description: 'List Cosense pages in the project.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
  async execute(
    _args: ListPagesArgs,
    { projectName, cosenseOptions }: ToolContext
  ): Promise<CallToolResult> {
    const result = await listPages(projectName, cosenseOptions);

    if (isErr(result)) {
      const error = unwrapErr(result);
      return {
        content: [
          {
            type: 'text',
            text: `Error: Failed to list pages from project "${projectName}": ${error}`,
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
  },
};

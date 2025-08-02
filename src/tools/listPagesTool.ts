import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { listPages } from '../cosense.js';
import { PageResource } from '../resource.js';
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
    const pageList = await listPages(projectName, cosenseOptions);
    const pages = pageList.pages.map((page) => new PageResource(page));

    return {
      content: [
        {
          type: 'text',
          text: pages.map((r) => r.description).join('\n-----\n'),
        },
      ],
    };
  },
};

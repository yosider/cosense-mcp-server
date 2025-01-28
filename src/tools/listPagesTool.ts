import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { PageResource, Resources } from '../resource.js';
import type { Tool } from './types.js';

export interface ListPagesContext {
  pageResources: Resources<PageResource>;
}

export const listPagesTool: Tool<ListPagesContext> = {
  name: 'list_pages',
  description: 'List Cosense pages in the resources.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
  async execute(
    _args: Record<string, unknown>,
    { pageResources }: ListPagesContext
  ): Promise<CallToolResult> {
    return {
      content: [
        {
          type: 'text',
          text: pageResources
            .getAll()
            .map((r) => r.description)
            .join('\n-----\n'),
        },
      ],
    };
  },
};

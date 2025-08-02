import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getPage, pageToText } from '../cosense.js';
import type { Tool, ToolContext } from './types.js';

type GetPageArgs = {
  pageTitle: string;
};

export const getPageTool: Tool<GetPageArgs> = {
  name: 'get_page',
  description: 'Get a page with the specified title from the Cosense project.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page',
      },
    },
    required: ['pageTitle'],
  },
  async execute(
    { pageTitle }: GetPageArgs,
    { projectName, cosenseOptions }: ToolContext
  ): Promise<CallToolResult> {
    const page = await getPage(projectName, pageTitle, cosenseOptions);
    return {
      content: [
        {
          type: 'text',
          text: pageToText(page),
        },
      ],
    };
  },
};

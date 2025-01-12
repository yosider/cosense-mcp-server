import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getPage, toReadablePage } from '../cosense.js';
import { Tool } from './types.js';

export interface GetPageContext {
  projectName: string;
  cosenseOptions: { sid?: string };
}

export const getPageTool: Tool<GetPageContext, { pageTitle: string }> = {
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
    { pageTitle }: { pageTitle: string },
    { projectName, cosenseOptions }: GetPageContext
  ): Promise<CallToolResult> {
    const page = await getPage(projectName, pageTitle, cosenseOptions);
    return {
      content: [
        {
          type: 'text',
          text: toReadablePage(page).description,
        },
      ],
    };
  },
};

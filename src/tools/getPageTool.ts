import { getPage } from '@cosense/std/rest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import { pageToText } from '../cosense.js';
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
    const result = await getPage(projectName, pageTitle, cosenseOptions);

    if (isErr(result)) {
      const error = unwrapErr(result);
      return {
        content: [
          {
            type: 'text',
            text: `Error: Failed to get page "${pageTitle}" from project "${projectName}": ${error}`,
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
  },
};

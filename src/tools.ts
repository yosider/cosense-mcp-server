import {
  CallToolResult,
  Tool as _Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { getPage, toReadablePage } from './cosense.js';
import { PageResource, Resources } from './resource.js';

export interface Tool<TContext = unknown, TArgs = Record<string, unknown>>
  extends _Tool {
  execute(args: TArgs, context: TContext): Promise<CallToolResult>;
}

interface GetPageContext {
  projectName: string;
  cosenseOptions: { sid?: string };
}

interface ListPagesContext {
  pageResources: Resources<PageResource>;
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

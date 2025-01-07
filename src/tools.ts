import {
  CallToolResult,
  Tool as _Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { getPage, toReadablePage } from './cosense.js';
import { PageResource, Resources } from './resource.js';

export interface ToolContext {
  projectName: string;
  cosenseOptions: { sid?: string };
  pageResources: Resources<PageResource>;
}

export interface Tool extends _Tool {
  execute(
    args: Record<string, unknown>,
    context: ToolContext
  ): Promise<CallToolResult>;
}

export class GetPageTool implements Tool {
  readonly name = 'get_page';
  [key: string]: unknown;

  get description() {
    return 'Get a page with the specified title from the Cosense project.';
  }

  readonly inputSchema = {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page',
      },
    },
    required: ['pageTitle'],
  };

  async execute(
    { pageTitle }: { pageTitle: string },
    { projectName, cosenseOptions }: ToolContext
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
  }
}

export class ListPagesTool implements Tool {
  readonly name = 'list_pages';
  [key: string]: unknown;

  get description() {
    return 'List Cosense pages in the resources.';
  }

  readonly inputSchema = {
    type: 'object' as const,
    properties: {},
    required: [],
  };

  async execute(
    _args: Record<string, unknown>,
    { pageResources }: ToolContext
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
  }
}

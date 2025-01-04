import {
  CallToolRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Config } from './config.js';
import { getPage, listPages, toReadablePage } from './cosense.js';
import { PageResource, Resources } from './resource.js';

export class Handlers {
  private resources: Resources<PageResource> = new Resources();
  private cosenseOptions: { sid?: string };

  constructor(private config: Config) {
    this.cosenseOptions = {
      sid: this.config.cosenseSid,
    };
  }

  async initialize() {
    const pageList = await listPages(
      this.config.projectName,
      this.cosenseOptions
    );
    pageList.pages.forEach((page) => {
      this.resources.add(new PageResource(page));
    });
    // output to stderr to avoid conflict with StdioServerTransport
    console.error(`Found ${this.resources.count} resources`);
  }

  async handleListResources() {
    return {
      resources: this.resources.getAll(),
    };
  }

  async handleReadResource(request: typeof ReadResourceRequestSchema._type) {
    const url = new URL(request.params.uri);
    const title = decodeURIComponent(url.pathname.replace(/^\//, ''));
    const page = await getPage(
      this.config.projectName,
      title,
      this.cosenseOptions
    );
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'text/plain',
          text: toReadablePage(page).description,
        },
      ],
    };
  }

  async handleListTools() {
    return {
      tools: [
        {
          name: 'get_page',
          description: `
          Get a page from ${this.config.projectName} project on cosen.se

          In cosense, a page is a cosense-style document with a title and a description.
          Bracket Notation makes links between pages.
          Example: [Page Title]
          -> "/${this.config.projectName}/Page Title"

          A page may have links to other pages.
          Links are rendered at the bottom of the page.
          `,
          inputSchema: {
            type: 'object',
            properties: {
              pageTitle: {
                type: 'string',
                description: 'Title of the page',
              },
            },
            required: ['pageTitle'],
          },
        },
        {
          name: 'list_pages',
          description: `List known cosense pages from ${this.config.projectName} project on cosen.se`,
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      ],
    };
  }

  async handleCallTool(request: typeof CallToolRequestSchema._type) {
    switch (request.params.name) {
      case 'get_page': {
        const pageTitle = String(request.params.arguments?.pageTitle);
        const page = await getPage(
          this.config.projectName,
          pageTitle,
          this.cosenseOptions
        );
        return {
          content: [
            {
              type: 'text',
              text: toReadablePage(page).description,
            },
          ],
        };
      }

      case 'list_pages': {
        return {
          content: [
            {
              type: 'text',
              text: this.resources.getNames(),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  }
}

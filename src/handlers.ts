import { listPages } from '@cosense/std/rest';
import {
  CallToolRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapOk } from 'option-t/PlainResult';
import { Config } from './config.js';
import { getPage, toReadablePage } from './cosense.js';
import { PageResources } from './page-resources.js';

export class Handlers {
  private pageResources: PageResources = new PageResources();
  private cosenseOptions: { sid?: string };

  constructor(private config: Config) {
    this.cosenseOptions = {
      sid: this.config.cosenseSid,
    };
  }

  async initialize() {
    const pagesResult = await listPages(
      this.config.projectName,
      this.cosenseOptions
    );

    if (isErr(pagesResult)) {
      throw new Error(`Failed to list pages: ${pagesResult.err}`);
    }

    unwrapOk(pagesResult).pages.forEach((page) => {
      this.pageResources.add(page);
    });
    // output to stderr to avoid conflict with StdioServerTransport
    console.error(`Found ${this.pageResources.count} resources`);
  }

  async handleListResources() {
    return {
      resources: this.pageResources.getAll(),
    };
  }

  async handleReadResource(request: typeof ReadResourceRequestSchema._type) {
    const url = new URL(request.params.uri);
    const title = url.pathname.replace(/^\//, '');
    let resource = this.pageResources.findByUri(request.params.uri);

    if (!resource) {
      const page = await getPage(
        this.config.projectName,
        title,
        this.cosenseOptions
      );
      resource = this.pageResources.add(page);
    }

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'text/plain',
          text: resource.description,
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
        const readablePage = toReadablePage(page);

        return {
          content: [
            {
              type: 'text',
              text: readablePage.description,
            },
          ],
        };
      }

      case 'list_pages': {
        return {
          content: [
            {
              type: 'text',
              text: this.pageResources.getNames(),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  }
}

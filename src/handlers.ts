import {
    CallToolRequestSchema,
    ReadResourceRequestSchema,
    Resource
} from "@modelcontextprotocol/sdk/types.js";
import { Config } from "./config.js";
import { getPage, listPages, toReadablePage } from "./cosense.js";

export class Handlers {
  private resources: Resource[] = [];

  constructor(private config: Config) {}

  async initialize() {
    const pages = await listPages(this.config.projectName, this.config.cosenseSid);
    this.resources = pages.pages.map((page) => ({
      uri: `cosense:///${page.title}`,
      mimeType: "text/plain",
      name: page.title,
      description: `A text page: ${page.title}`,
    }));
    console.info(`Found ${this.resources.length} resources`);
  }

  async handleListResources() {
    return {
      resources: this.resources,
    };
  }

  async handleReadResource(request: typeof ReadResourceRequestSchema._type) {
    const url = new URL(request.params.uri);
    const title = url.pathname.replace(/^\//, "");
    let page = this.resources.find((resource) => resource.uri === request.params.uri);

    if (!page) {
      const getPageResult = await getPage(
        this.config.projectName,
        title,
        this.config.cosenseSid
      );
      if (!getPageResult) {
        throw new Error(`Page ${title} not found`);
      }
      const readablePage = toReadablePage(getPageResult);
      page = {
        uri: request.params.uri,
        mimeType: "text/plain",
        name: readablePage.title,
        description: readablePage.description,
      };
      this.resources.push(page);
    }

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "text/plain",
          text: page.description,
        },
      ],
    };
  }

  async handleListTools() {
    return {
      tools: [
        {
          name: "get_page",
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
            type: "object",
            properties: {
              pageTitle: {
                type: "string",
                description: "Title of the page",
              },
            },
            required: ["pageTitle"],
          },
        },
        {
          name: "list_pages",
          description: `List known cosense pages from ${this.config.projectName} project on cosen.se`,
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      ],
    };
  }

  async handleCallTool(request: typeof CallToolRequestSchema._type) {
    switch (request.params.name) {
      case "get_page": {
        const pageTitle = String(request.params.arguments?.pageTitle);
        const page = await getPage(
          this.config.projectName,
          pageTitle,
          this.config.cosenseSid
        );
        if (!page) {
          throw new Error(`Page ${pageTitle} not found`);
        }
        const readablePage = toReadablePage(page);

        return {
          content: [
            {
              type: "text",
              text: readablePage.description,
            },
          ],
        };
      }

      case "list_pages": {
        return {
          content: [
            {
              type: "text",
              text: this.resources.map((resource) => resource.name).join("\n"),
            },
          ],
        };
      }

      default:
        throw new Error("Unknown tool");
    }
  }
}

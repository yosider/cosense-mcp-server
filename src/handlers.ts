import {
  CallToolRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Config } from './config.js';
import { listPages } from './cosense.js';
import { PageResource, Resources } from './resource.js';
import { GetPageTool, ListPagesTool, Tool, ToolContext } from './tools.js';

export class Handlers {
  private resources: Resources<PageResource> = new Resources();
  private cosenseOptions: { sid?: string };
  private tools: Tool[];

  constructor(private config: Config) {
    this.cosenseOptions = {
      sid: this.config.cosenseSid,
    };
    this.tools = [new GetPageTool(), new ListPagesTool()];
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
    const pageResource = this.resources.findByUri(request.params.uri);
    return await pageResource.read(
      this.config.projectName,
      this.cosenseOptions
    );
  }

  async handleListTools() {
    return {
      tools: this.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  }

  async handleCallTool(request: typeof CallToolRequestSchema._type) {
    const tool = this.tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const context: ToolContext = {
      projectName: this.config.projectName,
      cosenseOptions: this.cosenseOptions,
      resources: this.resources,
    };

    return await tool.execute(request.params.arguments ?? {}, context);
  }
}

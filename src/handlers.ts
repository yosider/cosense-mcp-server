import {
  CallToolRequest,
  CallToolResult,
  ListResourcesResult,
  ListToolsResult,
  ReadResourceRequest,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import { Config } from './config.js';
import { listPages } from './cosense.js';
import { PageResource, Resources } from './resource.js';
import { getPageTool, listPagesTool, Tool } from './tools/index.js';

export class Handlers {
  private pageResources: Resources<PageResource> = new Resources();
  private cosenseOptions: { sid?: string };
  private tools: Tool[];

  private constructor(private config: Config) {
    this.cosenseOptions = {
      sid: this.config.cosenseSid,
    };
    this.tools = [getPageTool, listPagesTool];
  }

  static async create(config: Config): Promise<Handlers> {
    const handlers = new Handlers(config);
    await handlers.loadPages();
    return handlers;
  }

  private async loadPages() {
    const pageList = await listPages(
      this.config.projectName,
      this.cosenseOptions
    );
    pageList.pages.forEach((page) => {
      this.pageResources.add(new PageResource(page));
    });
    // output to stderr to avoid conflict with StdioServerTransport
    console.error(`Found ${this.pageResources.count} resources`);
  }

  async handleListResources(): Promise<ListResourcesResult> {
    return {
      resources: this.pageResources.getAll(),
    };
  }

  async handleReadResource(
    request: ReadResourceRequest
  ): Promise<ReadResourceResult> {
    const pageResource = this.pageResources.findByUri(request.params.uri);
    return await pageResource.read(
      this.config.projectName,
      this.cosenseOptions
    );
  }

  async handleListTools(): Promise<ListToolsResult> {
    return {
      tools: this.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  }

  createToolContext<TContext>(tool: Tool<TContext>): TContext {
    switch (tool.name) {
      case getPageTool.name:
        return {
          projectName: this.config.projectName,
          cosenseOptions: this.cosenseOptions,
        } as TContext;
      case listPagesTool.name:
        return {
          pageResources: this.pageResources,
        } as TContext;
      default:
        throw new Error(`Unknown tool: ${tool.name}`);
    }
  }

  async handleCallTool(request: CallToolRequest): Promise<CallToolResult> {
    const tool = this.tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const context = this.createToolContext(tool);
    return await tool.execute(request.params.arguments ?? {}, context);
  }
}

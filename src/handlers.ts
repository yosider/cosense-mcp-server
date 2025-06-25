import type {
  CallToolRequest,
  CallToolResult,
  ListResourcesResult,
  ListToolsResult,
  ReadResourceRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types";
import type { Config } from "./config.ts";
import { listPages } from "./cosense.ts";
import { PageResource, Resources } from "./resource.ts";
import {
  getPageTool,
  insertLinesTool,
  listPagesTool,
  searchPagesTool,
  type Tool,
} from "./tools/index.ts";

export class Handlers {
  private projectName: string;
  private cosenseOptions: { sid?: string };
  private pageResources: Resources<PageResource> = new Resources();
  private tools: Tool[];

  private constructor(config: Config) {
    this.projectName = config.projectName;
    this.cosenseOptions = {
      sid: config.cosenseSid,
    };
    this.tools = [getPageTool, listPagesTool, searchPagesTool, insertLinesTool];
  }

  static async create(config: Config): Promise<Handlers> {
    const handlers = new Handlers(config);
    await handlers.loadPages();
    return handlers;
  }

  private async loadPages() {
    const pageList = await listPages(this.projectName, this.cosenseOptions);
    pageList.pages.forEach((page) => {
      this.pageResources.add(new PageResource(page));
    });
    // output to stderr to avoid conflict with StdioServerTransport
    console.error(`Found ${this.pageResources.count} resources`);
  }

  handleListResources(): Promise<ListResourcesResult> {
    return Promise.resolve({
      resources: this.pageResources.getAll(),
    });
  }

  async handleReadResource(
    request: ReadResourceRequest,
  ): Promise<ReadResourceResult> {
    const pageResource = this.pageResources.findByUri(request.params.uri);
    return await pageResource.read(this.projectName, this.cosenseOptions);
  }

  handleListTools(): Promise<ListToolsResult> {
    return Promise.resolve({
      tools: this.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    });
  }

  async handleCallTool(request: CallToolRequest): Promise<CallToolResult> {
    const tool = this.tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const context = this.createToolContext(tool);
    return await tool.execute(request.params.arguments ?? {}, context);
  }

  private createToolContext<TContext>(tool: Tool<TContext>): TContext {
    switch (tool.name) {
      case getPageTool.name:
        return {
          projectName: this.projectName,
          cosenseOptions: this.cosenseOptions,
        } as TContext;
      case listPagesTool.name:
        return {
          pageResources: this.pageResources,
        } as TContext;
      case searchPagesTool.name:
        return {
          projectName: this.projectName,
          cosenseOptions: this.cosenseOptions,
        } as TContext;
      case insertLinesTool.name:
        return {
          projectName: this.projectName,
          cosenseOptions: this.cosenseOptions,
        } as TContext;
      default:
        throw new Error(`Unknown tool: ${tool.name}`);
    }
  }
}

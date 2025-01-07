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
import { GetPageTool, ListPagesTool, Tool, ToolContext } from './tools.js';

export class Handlers {
  private pageResources: Resources<PageResource> = new Resources();
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

  async handleCallTool(request: CallToolRequest): Promise<CallToolResult> {
    const tool = this.tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const context: ToolContext = {
      projectName: this.config.projectName,
      cosenseOptions: this.cosenseOptions,
      pageResources: this.pageResources,
    };

    return await tool.execute(request.params.arguments ?? {}, context);
  }
}

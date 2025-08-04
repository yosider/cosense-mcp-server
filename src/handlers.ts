import { listPages } from '@cosense/std/rest';
import type {
  CallToolRequest,
  CallToolResult,
  ListResourcesResult,
  ListToolsResult,
  ReadResourceRequest,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import type { Config } from './config.js';
import { PageResource, Resources } from './resource.js';
import {
  getPageTool,
  insertLinesTool,
  listPagesTool,
  searchPagesTool,
  type Tool,
} from './tools/index.js';
import { logger } from './utils/logger.js';

export class Handlers {
  private projectName: string;
  private cosenseOptions: { sid?: string };
  private pageResources: Resources<PageResource> = new Resources();
  private tools: Tool<unknown>[];

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
    const result = await listPages(this.projectName, this.cosenseOptions);

    if (isErr(result)) {
      const error = unwrapErr(result);
      throw new Error(
        `Failed to load pages from project "${this.projectName}": ${error}`
      );
    }

    const pageList = unwrapOk(result);
    pageList.pages.forEach((page) => {
      this.pageResources.add(new PageResource(page));
    });
    logger.log(`Found ${this.pageResources.count} resources`);
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
    return await pageResource.read(this.projectName, this.cosenseOptions);
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

    const context = {
      projectName: this.projectName,
      cosenseOptions: this.cosenseOptions,
    };

    return await tool.execute(request.params.arguments ?? {}, context);
  }
}

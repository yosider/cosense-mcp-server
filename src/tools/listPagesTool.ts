import type { CallToolResult } from "@modelcontextprotocol/sdk/types";
import type { PageResource, Resources } from "../resource.ts";
import type { Tool } from "./types.ts";

export interface ListPagesContext {
  pageResources: Resources<PageResource>;
}

export const listPagesTool: Tool<ListPagesContext> = {
  name: "list_pages",
  description: "List Cosense pages in the resources.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  execute(
    _args: Record<string, unknown>,
    { pageResources }: ListPagesContext,
  ): Promise<CallToolResult> {
    return Promise.resolve({
      content: [
        {
          type: "text",
          text: pageResources
            .getAll()
            .map((r) => r.description)
            .join("\n-----\n"),
        },
      ],
    });
  },
};

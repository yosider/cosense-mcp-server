// #!/usr/bin/env node

// DenoではnpmパッケージのimportをURLまたはimport_map.json経由に変更
// dotenv → Deno標準のDeno.envで代用
// 拡張子.js → .ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getConfig } from "./config.ts";
import { Handlers } from "./handlers.ts";

if (import.meta.main) {
  const config = getConfig();
  const handlers = await Handlers.create(config);

  const server = new Server(
    {
      name: "cosense-mcp-server",
      version: "0.2.1",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    },
  );

  server.setRequestHandler(
    ListResourcesRequestSchema,
    () => handlers.handleListResources(),
  );
  server.setRequestHandler(
    ReadResourceRequestSchema,
    (req) => handlers.handleReadResource(req),
  );
  server.setRequestHandler(
    ListToolsRequestSchema,
    () => handlers.handleListTools(),
  );
  server.setRequestHandler(
    CallToolRequestSchema,
    (req) => handlers.handleCallTool(req),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

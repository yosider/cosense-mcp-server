#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { getConfig } from './config.js';
import { Handlers } from './handlers.js';

dotenv.config();

async function main() {
  const config = getConfig();
  const handlers = await Handlers.create(config);

  const server = new Server(
    {
      name: 'cosense-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  server.setRequestHandler(ListResourcesRequestSchema, () =>
    handlers.handleListResources()
  );
  server.setRequestHandler(ReadResourceRequestSchema, (req) =>
    handlers.handleReadResource(req)
  );
  server.setRequestHandler(ListToolsRequestSchema, () =>
    handlers.handleListTools()
  );
  server.setRequestHandler(CallToolRequestSchema, (req) =>
    handlers.handleCallTool(req)
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

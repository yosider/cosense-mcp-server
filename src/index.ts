#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { getConfig } from './config.js';
import { getPackageVersion } from './utils.js';

// Import tools
import { registerGetPageTool } from './tools/getPageTool.js';
import { registerInsertLinesTool } from './tools/insertLinesTool.js';
import { registerListPagesTool } from './tools/listPagesTool.js';
import { registerSearchPagesTool } from './tools/searchPagesTool.js';

// Import resources
import { registerPageResources } from './resources/pageResources.js';
import { registerSetLoggingLevel } from './logging.js';

dotenv.config({ quiet: true });

try {
  const config = getConfig();

  const server = new McpServer(
    {
      name: 'cosense-mcp-server',
      version: getPackageVersion(),
    },
    { capabilities: { logging: {} } }
  );

  // Register page resources
  registerPageResources(server, config);

  // Register tools
  registerGetPageTool(server, config);
  registerInsertLinesTool(server, config);
  registerListPagesTool(server, config);
  registerSearchPagesTool(server, config);

  registerSetLoggingLevel(server.server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error('Server error:', error);
  process.exit(1);
}

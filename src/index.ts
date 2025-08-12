#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { getConfig } from './config.js';
import { getPackageVersion } from './utils.js';
import { logger } from './utils/logger.js';

// Import tools
import { registerGetPageTool } from './tools/getPageTool.js';
import { registerInsertLinesTool } from './tools/insertLinesTool.js';
import { registerListPagesTool } from './tools/listPagesTool.js';
import { registerSearchPagesTool } from './tools/searchPagesTool.js';

// Import resources
import { registerPageResources } from './resources/pageResources.js';

dotenv.config();

try {
  const config = getConfig();

  const server = new McpServer(
    {
      name: 'cosense-mcp-server',
      version: getPackageVersion(),
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  // Register tools
  registerGetPageTool(server, config);
  registerInsertLinesTool(server, config);
  registerListPagesTool(server, config);
  registerSearchPagesTool(server, config);

  // Start page resource registration asynchronously
  const resourcesPromise = registerPageResources(server, config);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Now wait for resource registration to complete
  await resourcesPromise;
} catch (error) {
  logger.error('Server error:', error);
  process.exit(1);
}

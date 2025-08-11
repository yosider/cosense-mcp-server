import { getPage, listPages } from '@cosense/std/rest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import type { Config } from '../config.js';
import { generateDescription, pageToText } from '../cosense.js';
import { logger } from '../utils/logger.js';

export async function registerPageResources(server: McpServer, config: Config) {
  const cosenseOptions = {
    sid: config.cosenseSid,
  };

  // First, load all pages to populate the resource list
  const result = await listPages(config.projectName, cosenseOptions);

  if (isErr(result)) {
    const error = unwrapErr(result);
    throw new Error(
      `Failed to load pages from project "${config.projectName}": ${error}`
    );
  }

  const pageList = unwrapOk(result);
  logger.log(`Found ${pageList.pages.length} resources`);

  // Register individual page resources
  for (const page of pageList.pages) {
    const uri = `cosense:///${page.title}`;
    
    server.resource(
      page.title,
      uri,
      {
        name: page.title,
        description: generateDescription(page),
        mimeType: 'text/plain',
      },
      async () => {
        const pageResult = await getPage(config.projectName, page.title, cosenseOptions);

        if (isErr(pageResult)) {
          const error = unwrapErr(pageResult);
          throw new Error(
            `Failed to get page "${page.title}" from project "${config.projectName}": ${error}`
          );
        }

        const pageData = unwrapOk(pageResult);
        return {
          contents: [
            {
              uri: uri,
              mimeType: 'text/plain',
              text: pageToText(pageData),
            },
          ],
        };
      }
    );
  }
}
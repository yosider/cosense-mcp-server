import { patch } from "@cosense/std/websocket";
import type { FoundPage, Page, SearchResult } from "@cosense/types/rest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { unwrapErr } from "option-t/plain_result";
import z from "zod";
import { getConfig } from "./config.ts";
import { getPage, listPages, searchForPages } from "./cosense.ts";
import { PageResource, Resources } from "./resource.ts";
import denoJson from "./deno.json" with { type: "json" };

function foundPageToText({ title, words, lines }: FoundPage): string {
  return [
    `Page title: ${title}`,
    `Matched words: ${words.join(", ")}`,
    `Surrounding lines:`,
    lines.join("\n"),
  ].join("\n");
}

function searchResultToText({ query, count, pages }: SearchResult): string {
  const headerText = [
    `Search result for "${query}":`,
    `Found ${count} pages.`,
  ].join("\n");
  const pageText = pages.map((page) => foundPageToText(page)).join("\n\n");
  return [headerText, "", pageText].join("\n");
}

function pageToText(page: Page): string {
  console.log(page.relatedPages);
  const text = `
${page.lines.map((line) => line.text).join("\n")}

# Related Pages
## 1-hop links
${page.relatedPages.links1hop.map((page) => page.title).join("\n")}

## 2-hop links
${page.relatedPages.links2hop.map((page) => page.title).join("\n")}

## external links
${page.relatedPages.projectLinks1hop.map((page) => page.title).join("\n")}
`;
  return text;
}

if (import.meta.main) {
  const config = getConfig();

  const pageResources = new Resources<PageResource>();
  const pageList = await listPages(config.projectName, {
    sid: config.cosenseSid,
  });
  pageList.pages.forEach((page) => {
    pageResources.add(new PageResource(page));
  });
  console.error(`Found ${pageResources.count} resources`);

  const server = new McpServer({
    name: "cosense-mcp-server",
    version: denoJson.version,
  });

  server.registerResource(
    "page",
    "cosense:///{title}",
    {
      title: "Cosense page resource",
      description: "Cosense page resource",
      mimeType: "text/plain",
      list: () => pageResources.getAll().map((r) => ({ ...r })),
    },
    (uri) => {
      const pageResource = pageResources.findByUri(uri.href);
      return pageResource.read(config.projectName, { sid: config.cosenseSid });
    },
  );

  server.registerTool("get_page", {
    description:
      "Get a page with the specified title from the Cosense project.",
    inputSchema: { title: z.string().describe("Title of the page") },
  }, async ({ title }) => {
    const page = await getPage(config.projectName, title, {
      sid: config.cosenseSid,
    });
    return { content: [{ type: "text", text: pageToText(page) }] };
  });

  server.registerTool(
    "list_pages",
    {
      description: "List Cosense pages in the resources.",
      inputSchema: {},
    },
    () => {
      return Promise.resolve({
        content: [
          {
            type: "text",
            text: pageResources.getAll().map((r) => r.description).join(
              "\n-----\n",
            ),
          },
        ],
      });
    },
  );

  server.registerTool(
    "search_pages",
    {
      description:
        "Search for pages containing the specified query string in the Cosense project.",
      inputSchema: {
        query: z.string().describe("Search query string (space separated)"),
      },
    },
    async (args, _context) => {
      const { query } = args;
      const searchResult = await searchForPages(query, config.projectName, {
        sid: config.cosenseSid,
      });
      return {
        content: [
          {
            type: "text",
            text: searchResultToText(searchResult),
          },
        ],
      };
    },
  );

  server.registerTool(
    "insert_lines",
    {
      description:
        "Insert lines after the specified target line in a Cosense page. If the target line is not found, append to the end of the page.",
      inputSchema: {
        pageTitle: z.string().describe("Title of the page to modify"),
        targetLineText: z.string().describe(
          "Text of the line after which to insert new content. If not found, content will be appended to the end.",
        ),
        text: z.string().describe(
          "Text to insert. If you want to insert multiple lines, use \\n for line breaks.",
        ),
      },
    },
    async (args, _context) => {
      const { pageTitle, targetLineText, text } = args;
      const result = await patch(
        config.projectName,
        pageTitle,
        (lines) => {
          let index = lines.findIndex((line) => line.text === targetLineText);
          index = index < 0 ? lines.length : index;
          const linesText = lines.map((line) => line.text);
          return [
            ...linesText.slice(0, index + 1),
            ...text.split("\n"),
            ...linesText.slice(index + 1),
          ];
        },
        { sid: config.cosenseSid },
      );
      if (result.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Successfully inserted lines.`,
            },
          ],
        };
      } else {
        throw unwrapErr(result);
      }
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

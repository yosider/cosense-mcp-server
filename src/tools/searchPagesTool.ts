import type { FoundPage, SearchResult } from "@cosense/types/rest";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { searchForPages } from "../cosense.ts";
import type { Tool } from "./types.ts";

export interface SearchPagesContext {
  projectName: string;
  cosenseOptions: { sid?: string };
}

export const searchPagesTool: Tool<SearchPagesContext, { query: string }> = {
  name: "search_pages",
  description:
    "Search for pages containing the specified query string in the Cosense project.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search query string (space separated)",
      },
    },
    required: ["query"],
  },
  execute,
};

async function execute(
  { query }: { query: string },
  { projectName, cosenseOptions }: SearchPagesContext,
): Promise<CallToolResult> {
  const searchResult = await searchForPages(query, projectName, cosenseOptions);
  return {
    content: [
      {
        type: "text",
        text: searchResultToText(searchResult),
      },
    ],
  };
}

function searchResultToText({ query, count, pages }: SearchResult): string {
  const headerText = [
    `Search result for "${query}":`,
    `Found ${count} pages.`,
  ].join("\n");
  const pageText = pages.map((page) => foundPageToText(page)).join("\n\n");
  const text = [headerText, "", pageText].join("\n");
  return text;
}

function foundPageToText({ title, words, lines }: FoundPage): string {
  return [
    `Page title: ${title}`,
    `Matched words: ${words.join(", ")}`,
    `Surrounding lines:`,
    lines.join("\n"),
  ].join("\n");
}

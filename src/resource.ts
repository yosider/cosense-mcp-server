import type { BasePage } from "@cosense/types/rest";
import type {
  ReadResourceResult,
  Resource,
} from "@modelcontextprotocol/sdk/types";
import { getPage, pageToText } from "./cosense.ts";
import { formatDate } from "./utils.ts";

export class PageResource implements Resource {
  readonly uri: string;
  readonly name: string;
  readonly description?: string;
  readonly mimeType?: string;
  [key: string]: unknown;

  constructor(page: BasePage) {
    this.uri = `cosense:///${page.title}`;
    this.mimeType = "text/plain";
    this.name = page.title;
    this.description = generateDescription(page);
  }

  async read(
    projectName: string,
    options?: { sid?: string },
  ): Promise<ReadResourceResult> {
    const page = await getPage(projectName, this.name, options);
    return {
      contents: [
        {
          uri: this.uri,
          mimeType: this.mimeType,
          text: pageToText(page),
        },
      ],
    };
  }
}

function generateDescription(page: BasePage): string {
  return [
    `Title: ${page.title}`,
    `Description:`,
    ...page.descriptions,
    `Created: ${formatDate(page.created)}`,
    `Last Updated: ${formatDate(page.updated)}`,
    `Last Accessed: ${formatDate(page.accessed)}`,
    `Views: ${page.views}`,
    `Linked from: ${page.linked} pages`,
    `Page Rank: ${page.pageRank}`,
  ].join("\n");
}

export class Resources<T extends Resource> {
  private resources: T[] = [];

  add(resource: T): T {
    this.resources.push(resource);
    return resource;
  }

  findByUri(uri: string): T {
    const resource = this.resources.find((resource) => resource.uri === uri);
    if (!resource) {
      throw new Error(`Resource not found: ${uri}`);
    }
    return resource;
  }

  getAll(): T[] {
    return [...this.resources]; // return a copy
  }

  getNames(): string[] {
    return this.resources.map((resource) => resource.name);
  }

  get count(): number {
    return this.resources.length;
  }
}

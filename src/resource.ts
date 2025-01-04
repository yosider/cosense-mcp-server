import { BasePage } from '@cosense/types/rest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { formatDate } from './utils.js';

export class PageResource implements Resource {
  readonly uri: string;
  readonly name: string;
  readonly description?: string;
  readonly mimeType?: string;
  [key: string]: unknown;

  constructor(page: BasePage) {
    this.uri = `cosense:///${page.title}`;
    this.mimeType = 'text/plain';
    this.name = page.title;
    this.description = generateDescription(page);
  }
}

function generateDescription(page: BasePage): string {
  return [
    `Title: ${page.title}`,
    `Description: "${page.descriptions.join('\n')}"`,
    `Created: ${formatDate(page.created)}`,
    `Last Updated: ${formatDate(page.updated)}`,
    `Last Accessed: ${formatDate(page.accessed)}`,
    `Views: ${page.views}`,
    `Linked from: ${page.linked} pages`,
    `Page Rank: ${page.pageRank}`,
  ].join(', ');
}

export class Resources<T extends Resource> {
  private resources: T[] = [];

  add(resource: T): T {
    this.resources.push(resource);
    return resource;
  }

  findByUri(uri: string): T | undefined {
    return this.resources.find((resource) => resource.uri === uri);
  }

  getAll(): T[] {
    return [...this.resources]; // return a copy
  }

  getNames(): string {
    return this.resources.map((resource) => resource.name).join('\n');
  }

  get count(): number {
    return this.resources.length;
  }
}

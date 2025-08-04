import { getPage } from '@cosense/std/rest';
import type { PageSummery } from '@cosense/types/rest';
import type {
  ReadResourceResult,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';
import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result';
import { pageToText } from './cosense.js';
import { formatDate } from './utils.js';

export class PageResource implements Resource {
  readonly uri: string;
  readonly name: string;
  readonly description?: string;
  readonly mimeType?: string;
  [key: string]: unknown;

  constructor(page: PageSummery) {
    this.uri = `cosense:///${page.title}`;
    this.mimeType = 'text/plain';
    this.name = page.title;
    this.description = generateDescription(page);
  }

  async read(
    projectName: string,
    options?: { sid?: string }
  ): Promise<ReadResourceResult> {
    const result = await getPage(projectName, this.name, options);

    if (isErr(result)) {
      const error = unwrapErr(result);
      throw new Error(
        `Failed to get page "${this.name}" from project "${projectName}": ${error}`
      );
    }

    const page = unwrapOk(result);
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

function generateDescription(page: PageSummery): string {
  return [
    `Title: ${page.title}`,
    `Description:`,
    ...page.descriptions,
    `Created: ${formatDate(page.created)}`,
    `Last Updated: ${formatDate(page.updated)}`,
    `Last Accessed: ${formatDate(page.accessed)}`,
    `Views: ${page.views}`,
    `Linked from: ${page.linked} pages`,
  ].join('\n');
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

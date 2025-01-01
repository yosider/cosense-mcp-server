import { BasePage } from "@cosense/types/rest";
import { Resource } from "@modelcontextprotocol/sdk/types.js";

export class PageResources {
  private resources: Resource[] = [];

  add(page: BasePage): Resource {
    const resource = {
      uri: `cosense:///${page.title}`,
      mimeType: "text/plain",
      name: page.title,
      description: `A text page: ${page.title}`,
    };
    this.addResource(resource);
    return resource;
  }

  private addResource(resource: Resource): void {
    this.resources.push(resource);
  }

  findByUri(uri: string): Resource | undefined {
    return this.resources.find((resource) => resource.uri === uri);
  }

  getAll(): Resource[] {
    return [...this.resources];  // return a copy
  }

  getNames(): string {
    return this.resources.map((resource) => resource.name).join("\n");
  }

  get count(): number {
    return this.resources.length;
  }
}
import type { Page } from "@cosense/types/rest";

function toReadablePage(page: Page): {
  title: string;
  description: string;
} {
  const titleAndDescription = `
${page.title}
---

${page.lines.map((line) => line.text).join("\n")}
`;

  const relatedPages =
    page.links.length > 0
      ? `## 関連するページのタイトル
${page.links.join("\n")}
`
      : "";
  return {
    title: page.title,
    description: titleAndDescription + "\n" + relatedPages,
  };
}

// /api/pages/:projectname
type ListPagesResponse = {
  limit: number;
  count: number;
  skip: number;
  projectName: string;
  pages: {
    title: string;
  }[];
};

async function listPages(
  projectName: string,
  sid?: string,
): Promise<ListPagesResponse> {
  const response = sid
    ? await fetch(`https://cosen.se/api/pages/${projectName}`, {
        headers: { Cookie: `connect.sid=${sid}` },
      })
    : await fetch(`https://cosen.se/api/pages/${projectName}`);
  const pages = await response.json();
  return pages as ListPagesResponse;
}

export { getPage, listPages, toReadablePage };


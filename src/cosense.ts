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

export { toReadablePage };


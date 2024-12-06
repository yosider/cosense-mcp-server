/** 雑な型を使っている */

// /api/pages/:projectname/:pagetitle
type GetPageResponse = {
  id: string;
  title: string;
  descriptions: string[];
  links: string[];
  relatedPages: {
    links1hop: {
      title: string;
      descriptions: string[];
    }[];
  };
};

async function getPage(
  projectName: string,
  pageName: string,
  sid?: string,
): Promise<GetPageResponse | null> {
  const response = sid
    ? await fetch(`https://cosen.se/api/pages/${projectName}/${pageName}`, {
        headers: { Cookie: `connect.sid=${sid}` },
      }).catch(() => null)
    : await fetch(
        `https://cosen.se/api/pages/${projectName}/${pageName}`,
      ).catch(() => null);

  // const page = await response.json();
  // return page as GetPageResponse;
  if (!response) {
    return null;
  }
  const page = await response.json();
  return page as GetPageResponse;
}

function toReadablePage(page: GetPageResponse): {
  title: string;
  description: string;
} {
  const description = `
${page.descriptions.join("\n")}

## 関連するページのタイトル
${page.links.join("\n")}
  `;
  return {
    title: page.title,
    description,
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

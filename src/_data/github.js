module.exports = async function () {
  const username = "sylvia-ymlin";

  const headers = {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };

  function makeSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function fixImagePaths(markdown, repoName) {
    const base = `https://raw.githubusercontent.com/${username}/${repoName}/main`;
    // Fix HTML <img src="relative/...">
    markdown = markdown.replace(
      /<img([^>]+?)src=["'](?!https?:\/\/)([^"']+)["']/gi,
      (_, before, path) => `<img${before}src="${base}/${path.replace(/^\.\//, "")}"`
    );
    // Fix markdown ![alt](relative/...)
    markdown = markdown.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (_, alt, path) => `![${alt}](${base}/${path.replace(/^\.\//, "")})`
    );
    return markdown;
  }

  function extractFirstImage(markdown, repoName) {
    // Find all markdown images and pick the first non-badge one
    const badgeHosts = ["shields.io", "badge.fury.io", "travis-ci", "circleci", "codecov.io", "img.shields"];
    const mdImgRe = /!\[.*?\]\(([^)]+)\)/g;
    let match;
    while ((match = mdImgRe.exec(markdown)) !== null) {
      const src = match[1].trim();
      if (badgeHosts.some((h) => src.includes(h))) continue;
      if (src.startsWith("http")) return src;
      const clean = src.replace(/^\.\//, "");
      return `https://raw.githubusercontent.com/${username}/${repoName}/main/${clean}`;
    }
    // Fall back to HTML img
    const htmlImg = markdown.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (htmlImg) {
      const src = htmlImg[1].trim();
      if (!badgeHosts.some((h) => src.includes(h))) {
        if (src.startsWith("http")) return src;
        return `https://raw.githubusercontent.com/${username}/${repoName}/main/${src.replace(/^\.\//, "")}`;
      }
    }
    return null;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=public`,
      { headers }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json();

    const filtered = repos.filter(
      (r) => !r.fork && r.name !== `${username}.github.io`
    );

    const results = await Promise.all(
      filtered.map(async (r) => {
        let readme = null;
        let coverImage = null;
        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${username}/${r.name}/readme`,
            { headers }
          );
          if (readmeRes.ok) {
            const data = await readmeRes.json();
            const raw = Buffer.from(data.content, "base64").toString("utf-8");
            readme = fixImagePaths(raw, r.name);
            coverImage = extractFirstImage(readme, r.name);
          }
        } catch {}

        return {
          name: r.name,
          description: r.description || "",
          url: r.html_url,
          stars: r.stargazers_count,
          language: r.language,
          updatedAt: r.updated_at,
          readme,
          coverImage,
          slug: makeSlug(r.name),
        };
      })
    );

    return results;
  } catch (e) {
    console.warn("Failed to fetch GitHub repos:", e.message);
    return [];
  }
};

module.exports = async function () {
  const username = "sylvia-ymlin";

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=public`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json();

    return repos
      .filter((r) => !r.fork && r.name !== `${username}.github.io`)
      .map((r) => ({
        name: r.name,
        description: r.description || "",
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        updatedAt: r.updated_at,
      }));
  } catch (e) {
    console.warn("Failed to fetch GitHub repos:", e.message);
    return [];
  }
};

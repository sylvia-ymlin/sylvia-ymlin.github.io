const githubFn = require("./github.js");

module.exports = async function () {
  const repos = await githubFn();
  return repos.filter((r) => r.readme);
};

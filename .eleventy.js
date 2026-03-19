const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Date filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("relativeDate", (dateObj) => {
    const now = DateTime.now();
    const date = DateTime.fromJSDate(dateObj, { zone: "utc" });
    const diff = now.diff(date, ["years", "months", "days"]).toObject();
    if (diff.years >= 1) return `${Math.floor(diff.years)} year${Math.floor(diff.years) > 1 ? "s" : ""} ago`;
    if (diff.months >= 1) return `${Math.floor(diff.months)} month${Math.floor(diff.months) > 1 ? "s" : ""} ago`;
    if (diff.days >= 1) return `${Math.floor(diff.days)} day${Math.floor(diff.days) > 1 ? "s" : ""} ago`;
    return "today";
  });

  eleventyConfig.addFilter("monthName", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMMM");
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy");
  });

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMM d");
  });

  // First N characters of a string
  eleventyConfig.addFilter("first", (str, n) => String(str).substring(0, n || 3));

  // Word count filter
  eleventyConfig.addFilter("wordCount", (content) => {
    if (!content) return 0;
    return content.replace(/<[^>]*>/g, "").split(/\s+/).filter(w => w.length > 0).length;
  });

  // Limit filter
  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  // Sort by date descending
  eleventyConfig.addFilter("sortByDate", (arr) => {
    return arr.sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

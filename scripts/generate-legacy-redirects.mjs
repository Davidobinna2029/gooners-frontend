import fs from "fs";
import path from "path";

const WP_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

const OUTPUT_DIR = path.join(process.cwd(), "generated");

const REDIRECTS_FILE = path.join(
  OUTPUT_DIR,
  "legacy-redirects.json"
);

const SITEMAP_FILE = path.join(
  OUTPUT_DIR,
  "sitemap-posts.json"
);

// ---------------------------------------------------------
// Sitemap policy
// ---------------------------------------------------------
//
// Keep redirects for ALL published WordPress posts.
//
// Only posts published on or after this date are eligible
// for the public XML sitemap.
//
// This removes the known 2015/2020 legacy imports without
// breaking their redirects.
//
const SITEMAP_CUTOFF = "2024-01-01T00:00:00.000Z";

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API request failed: ${response.status} ${response.statusText}\n${url}`
    );
  }

  return response.json();
}

async function fetchAllPosts() {
  const posts = [];

  let page = 1;

  while (true) {
    const url = new URL(`${WP_API}/posts`);

    url.searchParams.set("status", "publish");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("_fields", "id,slug,date,modified");

    console.log(`Fetching WordPress posts page ${page}...`);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 400 && page > 1) {
      break;
    }

    if (!response.ok) {
      throw new Error(
        `WordPress API request failed: ${response.status} ${response.statusText}\n${url}`
      );
    }

    const batch = await response.json();

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    posts.push(...batch);

    const totalPages = Number(
      response.headers.get("X-WP-TotalPages") || 0
    );

    if (totalPages && page >= totalPages) {
      break;
    }

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return posts;
}

// ---------------------------------------------------------
// Main
// ---------------------------------------------------------

async function main() {
  console.log("");
  console.log("==============================================");
  console.log(" ArsenalTalks build data generation");
  console.log("==============================================");
  console.log("");

  const posts = await fetchAllPosts();

  console.log(`WordPress posts scanned: ${posts.length}`);

  const redirects = {};
  const sitemapMap = new Map();

  let sitemapExcluded = 0;
  let invalidPosts = 0;

  for (const post of posts) {
    if (!post || typeof post !== "object") {
      invalidPosts += 1;
      continue;
    }

    const slug =
      typeof post.slug === "string"
        ? post.slug.trim()
        : "";

    const date =
      typeof post.date === "string"
        ? post.date
        : null;

    const modified =
      typeof post.modified === "string"
        ? post.modified
        : null;

    if (!slug) {
      invalidPosts += 1;
      continue;
    }

    // -----------------------------------------------------
    // Keep redirects for every published post.
    // -----------------------------------------------------

    redirects[slug] = `/news/${slug}/`;

    // -----------------------------------------------------
    // Sitemap eligibility.
    //
    // Only posts published from 2024-01-01 onward.
    // -----------------------------------------------------

    if (!date) {
      sitemapExcluded += 1;
      continue;
    }

    const publishedTime = new Date(date);

    if (Number.isNaN(publishedTime.getTime())) {
      sitemapExcluded += 1;
      continue;
    }

    if (
      publishedTime.getTime() <
      new Date(SITEMAP_CUTOFF).getTime()
    ) {
      sitemapExcluded += 1;
      continue;
    }

    sitemapMap.set(slug, {
      slug,
      date,
      modified,
    });
  }

  // ---------------------------------------------------------
  // Sort sitemap posts newest first.
  //
  // Prefer modified date because updated articles should remain
  // near the top of the generated dataset.
  // ---------------------------------------------------------

  const sitemapPosts = Array.from(
    sitemapMap.values()
  ).sort((a, b) => {
    const aDate = new Date(
      a.modified || a.date
    ).getTime();

    const bDate = new Date(
      b.modified || b.date
    ).getTime();

    return bDate - aDate;
  });

  // ---------------------------------------------------------
  // Ensure generated directory exists.
  // ---------------------------------------------------------

  fs.mkdirSync(OUTPUT_DIR, {
    recursive: true,
  });

  // ---------------------------------------------------------
  // Write redirect map.
  // ---------------------------------------------------------

  fs.writeFileSync(
    REDIRECTS_FILE,
    JSON.stringify(redirects, null, 2),
    "utf8"
  );

  // ---------------------------------------------------------
  // Write sitemap dataset.
  // ---------------------------------------------------------

  fs.writeFileSync(
    SITEMAP_FILE,
    JSON.stringify(sitemapPosts, null, 2),
    "utf8"
  );

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------

  console.log("");
  console.log("==============================================");
  console.log(" Build data generation completed successfully");
  console.log("==============================================");
  console.log("");

  console.log(
    `WordPress posts scanned: ${posts.length}`
  );

  console.log(
    `Legacy redirects generated: ${
      Object.keys(redirects).length
    }`
  );

  console.log(
    `Sitemap posts accepted: ${sitemapPosts.length}`
  );

  console.log(
    `Sitemap posts excluded: ${sitemapExcluded}`
  );

  console.log(
    `Invalid posts skipped: ${invalidPosts}`
  );

  console.log(
    `Sitemap cutoff: ${SITEMAP_CUTOFF}`
  );

  console.log("");

  console.log(
    `Redirect file: ${REDIRECTS_FILE}`
  );

  console.log(
    `Sitemap data file: ${SITEMAP_FILE}`
  );

  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("==============================================");
  console.error(" BUILD DATA GENERATION FAILED");
  console.error("==============================================");
  console.error("");
  console.error(error);
  console.error("");

  process.exit(1);
});
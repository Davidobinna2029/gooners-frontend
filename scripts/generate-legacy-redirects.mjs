import fs from "node:fs";
import path from "node:path";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const WP_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

const OUTPUT_DIR = path.join(
  process.cwd(),
  "generated"
);

const REDIRECTS_FILE = path.join(
  OUTPUT_DIR,
  "legacy-redirects.json"
);

const SITEMAP_FILE = path.join(
  OUTPUT_DIR,
  "sitemap-posts.json"
);

const RESERVED_ROUTES = new Set([
  "admin",
  "api",
  "category",
  "control-room",
  "fixtures",
  "live",
  "login",
  "news",
  "opinion",
  "search",
  "standings",
  "transfers",
  "videos",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30_000;
const RETRY_DELAY = 2_000;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchPosts(page) {
  const url = new URL(
    `${WP_API}/posts`
  );

  url.searchParams.set(
    "status",
    "publish"
  );

  url.searchParams.set(
    "per_page",
    "100"
  );

  url.searchParams.set(
    "page",
    String(page)
  );

  url.searchParams.set(
    "_fields",
    "slug,date,modified"
  );

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    );

    try {
      console.log(
        `Page ${page}: request attempt ${attempt}/${MAX_RETRIES}`
      );

      const response =
        await fetch(
          url.toString(),
          {
            headers: {
              Accept:
                "application/json",
            },

            signal:
              controller.signal,
          }
        );

      clearTimeout(timeout);

      if (
        response.status === 400 &&
        page > 1
      ) {
        return [];
      }

      if (!response.ok) {
        throw new Error(
          `WordPress API returned ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);

      lastError = error;

      console.error(
        `Page ${page}: attempt ${attempt} failed`
      );

      console.error(error);

      if (
        attempt <
        MAX_RETRIES
      ) {
        console.log(
          `Page ${page}: retrying in ${RETRY_DELAY / 1000}s...`
        );

        await sleep(
          RETRY_DELAY
        );
      }
    }
  }

  throw new Error(
    `Failed to fetch WordPress page ${page} after ${MAX_RETRIES} attempts.`,
    {
      cause: lastError,
    }
  );
}

async function main() {
  console.log("");
  console.log(
    "ArsenalTalks build data generator"
  );
  console.log(
    "---------------------------------"
  );
  console.log(
    `WordPress API: ${WP_API}`
  );
  console.log(
    `Request timeout: ${REQUEST_TIMEOUT / 1000}s`
  );
  console.log(
    `Maximum retries: ${MAX_RETRIES}`
  );
  console.log("");

  const redirects = {};
  const sitemapPosts = [];

  let page = 1;
  let totalPosts = 0;

  while (true) {
    console.log(
      `Fetching WordPress posts page ${page}...`
    );

    const posts =
      await fetchPosts(page);

    if (!posts.length) {
      break;
    }

    totalPosts += posts.length;

    for (const post of posts) {
      const slug =
        post?.slug?.trim();

      if (!slug) {
        continue;
      }

      /*
       * ---------------------------------------------------
       * LEGACY REDIRECT DATA
       * ---------------------------------------------------
       */

      if (
        !RESERVED_ROUTES.has(
          slug.toLowerCase()
        )
      ) {
        redirects[slug] =
          `/news/${slug}/`;
      }

      /*
       * ---------------------------------------------------
       * SITEMAP DATA
       * ---------------------------------------------------
       */

      sitemapPosts.push({
        slug,

        date:
          typeof post?.date ===
          "string"
            ? post.date
            : null,

        modified:
          typeof post?.modified ===
          "string"
            ? post.modified
            : null,
      });
    }

    console.log(
      `Page ${page}: received ${posts.length} posts`
    );

    if (
      posts.length < 100
    ) {
      break;
    }

    page++;
  }

  fs.mkdirSync(
    OUTPUT_DIR,
    {
      recursive: true,
    }
  );

  /*
   * -----------------------------------------------------
   * WRITE LEGACY REDIRECTS
   * -----------------------------------------------------
   */

  fs.writeFileSync(
    REDIRECTS_FILE,
    JSON.stringify(
      redirects,
      null,
      2
    ) + "\n",
    "utf8"
  );

  /*
   * -----------------------------------------------------
   * WRITE SITEMAP DATA
   * -----------------------------------------------------
   */

  fs.writeFileSync(
    SITEMAP_FILE,
    JSON.stringify(
      sitemapPosts,
      null,
      2
    ) + "\n",
    "utf8"
  );

  console.log("");
  console.log(
    "Build data generation completed successfully."
  );
  console.log("");
  console.log(
    `WordPress posts scanned: ${totalPosts}`
  );
  console.log(
    `Legacy redirects generated: ${
      Object.keys(redirects).length
    }`
  );
  console.log(
    `Sitemap posts generated: ${
      sitemapPosts.length
    }`
  );
  console.log("");
  console.log(
    `Redirect output: ${REDIRECTS_FILE}`
  );
  console.log(
    `Sitemap output: ${SITEMAP_FILE}`
  );
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error(
    "ArsenalTalks build data generation FAILED."
  );
  console.error(error);
  console.error("");

  process.exit(1);
});
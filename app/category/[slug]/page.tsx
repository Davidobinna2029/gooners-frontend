import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NewsCard from "@/components/news/NewsCard";

import {
  getCategoryPosts,
} from "@/lib/api/wordpress";

import {
  mapWordPressPosts,
} from "@/lib/mappers/wordpressMapper";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_NAME = "ArsenalTalks";
const SITE_URL = "https://arsenaltalks.com";

type CategoryInfo = {
  name: string;
  description: string;
};

const CATEGORY_INFO: Record<
  string,
  CategoryInfo
> = {
  arsenal: {
    name: "Arsenal",
    description:
      "The latest Arsenal news, team updates, match developments and stories from ArsenalTalks.",
  },

  "transfer-news": {
    name: "Transfer News",
    description:
      "The latest Arsenal transfer news, rumours, targets, signings and updates from ArsenalTalks.",
  },

  "injury-news": {
    name: "Injury News",
    description:
      "The latest Arsenal injury news, player fitness updates, return dates and team news from ArsenalTalks.",
  },

  women: {
    name: "Arsenal Women",
    description:
      "The latest Arsenal Women news, match reports, transfers, player updates and team developments.",
  },

  academy: {
    name: "Arsenal Academy",
    description:
      "The latest Arsenal Academy news, youth-team updates, academy players, fixtures and developments from ArsenalTalks.",
  },

  "loan-watch": {
    name: "Loan Watch",
    description:
      "The latest Arsenal loan news, loanee performances, player updates and developments from ArsenalTalks.",
  },
};

function formatCategoryName(
  slug: string
): string {
  const info = CATEGORY_INFO[slug];

  if (info) {
    return info.name;
  }

  return slug
    .split("-")
    .map((word) =>
      word.length
        ? word.charAt(0).toUpperCase() +
          word.slice(1)
        : word
    )
    .join(" ");
}

function getCategoryDescription(
  slug: string
): string {
  return (
    CATEGORY_INFO[slug]?.description ||
    `The latest ${formatCategoryName(
      slug
    )} news, updates and stories from ArsenalTalks.`
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const categoryName =
    formatCategoryName(slug);

  const description =
    getCategoryDescription(slug);

  const canonicalUrl =
    `${SITE_URL}/category/${slug}`;

  return {
    title:
      `${categoryName} News | ArsenalTalks`,

    description,

    metadataBase:
      new URL(SITE_URL),

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",

      locale: "en_GB",

      url: canonicalUrl,

      siteName: SITE_NAME,

      title:
        `${categoryName} News | ArsenalTalks`,

      description,
    },

    twitter: {
      card: "summary",

      title:
        `${categoryName} News | ArsenalTalks`,

      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  /*
   * Only allow categories that actually exist
   * in the ArsenalTalks WordPress taxonomy.
   */
  if (!CATEGORY_INFO[slug]) {
    notFound();
  }

  /*
   * Fetch posts belonging to the requested
   * WordPress category.
   */
  const rawPosts =
    await getCategoryPosts(slug);

  /*
   * If WordPress has no posts for the category,
   * return a 404 rather than an empty SEO page.
   */
  if (
    !rawPosts ||
    rawPosts.length === 0
  ) {
    notFound();
  }

  /*
   * Convert WordPress data into the structure
   * expected by NewsCard.
   */
  const posts =
    mapWordPressPosts(rawPosts);

  const categoryName =
    formatCategoryName(slug);

  const description =
    getCategoryDescription(slug);

  return (
    <main className="category-page">
      <div className="container">

        <header className="category-header">
          <p className="category-eyebrow">
            {SITE_NAME}
          </p>

          <h1 className="category-title">
            {categoryName} News
          </h1>

          <p className="category-description">
            {description}
          </p>
        </header>

        <div className="news-grid">
          {posts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </div>

      </div>
    </main>
  );
}
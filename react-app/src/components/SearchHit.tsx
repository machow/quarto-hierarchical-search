import type { Hit as AlgoliaHit } from "instantsearch.js";
import { Highlight } from "react-instantsearch";

type QuartoHit = AlgoliaHit<{
  href: string;
  title: string;
  section: string;
  text: string;
  guide: number;
  crumbs?: {
    lvl0?: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
  };
}>;

function sanitizeHref(href: string): string | undefined {
  try {
    const url = new URL(href, window.location.origin);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return href;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function SearchHit({ hit }: { hit: QuartoHit }) {
  const crumbs = hit.crumbs;
  const breadcrumb = crumbs
    ? [crumbs.lvl0, crumbs.lvl1, crumbs.lvl2, crumbs.lvl3]
        .filter(Boolean)
        .map((c) => c!.split(" > ").pop())
        .join(" › ")
    : null;

  const href = sanitizeHref(hit.href);

  return (
    <article className="search-hit">
      <a href={href} className="hit-link">
        <h3 className="hit-title">
          <Highlight attribute="title" hit={hit} />
        </h3>
        {hit.section && (
          <h4 className="hit-section">
            <Highlight attribute="section" hit={hit} />
          </h4>
        )}
        {breadcrumb && <div className="hit-breadcrumb">{breadcrumb}</div>}
        <p className="hit-text">
          <Highlight attribute="text" hit={hit} />
        </p>
      </a>
    </article>
  );
}

export type { QuartoHit };

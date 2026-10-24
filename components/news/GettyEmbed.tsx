
"use client";

import { useEffect, useRef } from "react";

interface GettyWidgetConfig {
  id: string;
  sig: string;
  items: string;
  w: string;
  h: string;
  caption: boolean;
  tld: string;
  is360: boolean;
}

type GettyCallback = () => void;

type GettyLoader = {
  (callback: GettyCallback): void;
  q?: GettyCallback[];
  widgets?: {
    load: (config: GettyWidgetConfig) => void;
  };
};

declare global {
  interface Window {
    gie?: GettyLoader;
  }
}

interface GettyEmbedProps {
  id: string;
  sig: string;
  items: string;
  width?: string;
  height?: string;
  caption?: boolean;
  tld?: string;
  is360?: boolean;
}

const GETTY_SCRIPT =
  "https://embed-cdn.gettyimages.com/widgets.js";

export default function GettyEmbed({
  id,
  sig,
  items,
  width = "594px",
  height = "396px",
  caption = true,
  tld = "com",
  is360 = false,
}: GettyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !id || !sig || !items) {
      console.error("[GETTY EMBED] Missing required settings", {
        id,
        hasSignature: Boolean(sig),
        hasItems: Boolean(items),
      });
      return;
    }

    let cancelled = false;

    const config: GettyWidgetConfig = {
      id,
      sig,
      items,
      w: width,
      h: height,
      caption,
      tld,
      is360,
    };

    container.replaceChildren();

    const anchor = document.createElement("a");
    anchor.id = id;
    anchor.className = "gie-single";
    anchor.href =
      `https://www.gettyimages.${tld}/detail/${encodeURIComponent(items)}`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.style.cssText =
      "display:inline-block;width:100%;max-width:100%;";

    anchor.textContent = "Embed from Getty Images";
    container.appendChild(anchor);

    // Match Getty's official embed bootstrap: queue the widget
    // callback before adding the asynchronous script.
    if (!window.gie || typeof window.gie !== "function") {
      const loader = ((callback: GettyCallback) => {
        loader.q = loader.q || [];
        loader.q.push(callback);
      }) as GettyLoader;

      window.gie = loader;
    }

    const gie = window.gie;

    const renderWidget = () => {
      if (cancelled) return;

      const currentGie = window.gie;

      if (!currentGie?.widgets?.load) {
        console.error(
          "[GETTY EMBED] Getty script did not initialize widgets.load",
          { id, items }
        );
        return;
      }

      try {
        currentGie.widgets.load(config);
      } catch (error) {
        console.error("[GETTY EMBED] Widget rendering failed", {
          id,
          items,
          error,
        });
      }
    };

    // This callback was missing from the previous version.
    gie(() => {
      renderWidget();
    });

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${GETTY_SCRIPT}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = GETTY_SCRIPT;
      script.async = true;
      script.charset = "utf-8";

      script.onerror = () => {
        console.error("[GETTY EMBED] Failed to download Getty's script.");
      };

      document.head.appendChild(script);
    }

    const observer = new MutationObserver(() => {
      const widget = container.querySelector<HTMLElement>(".getty");

      if (widget) {
        widget.style.setProperty("width", "100%", "important");
        widget.style.setProperty("max-width", "100%", "important");
        widget.style.setProperty("margin", "0 auto", "important");
      }

      const iframe =
        container.querySelector<HTMLIFrameElement>("iframe");

      if (iframe) {
        iframe.style.setProperty("display", "block", "important");
        iframe.style.setProperty("width", "100%", "important");
        iframe.style.setProperty("max-width", "100%", "important");
        iframe.style.setProperty("border", "0", "important");
        iframe.style.setProperty("box-sizing", "border-box", "important");
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [id, sig, items, width, height, caption, tld, is360]);

  return (
    <div
      ref={containerRef}
      className="getty-embed"
      data-getty-id={id}
      style={{
        display: "block",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        margin: "16px auto",
      }}
    />
  );
}

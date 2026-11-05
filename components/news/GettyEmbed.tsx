
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

let scriptPromise: Promise<void> | null = null;

function getPixels(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function initializeGettyLoader(): GettyLoader {
  if (window.gie) return window.gie;

  const loader = ((callback: GettyCallback) => {
    loader.q = loader.q || [];
    loader.q.push(callback);
  }) as GettyLoader;

  window.gie = loader;
  return loader;
}

function loadGettyScript(): Promise<void> {
  if (window.gie?.widgets?.load) {
    return Promise.resolve();
  }

  if (scriptPromise) return scriptPromise;

  initializeGettyLoader();

  scriptPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${GETTY_SCRIPT}"]`
    );

    const onLoad = () => {
      if (window.gie?.widgets?.load) {
        resolve();
      } else {
        reject(
          new Error("Getty widget renderer was not initialized.")
        );
      }
    };

    const onError = () => {
      reject(new Error("Getty script could not be downloaded."));
    };

    if (script?.dataset.gettyLoaded === "true") {
      onLoad();
      return;
    }

    if (script?.dataset.gettyFailed === "true") {
      script.remove();
      script = null;
    }

    if (script) {
      script.addEventListener("load", onLoad, { once: true });
      script.addEventListener("error", onError, { once: true });
      return;
    }

    script = document.createElement("script");
    script.src = GETTY_SCRIPT;
    script.async = true;
    script.charset = "utf-8";

    script.addEventListener(
      "load",
      () => {
        script!.dataset.gettyLoaded = "true";
        onLoad();
      },
      { once: true }
    );

    script.addEventListener(
      "error",
      () => {
        script!.dataset.gettyFailed = "true";
        onError();
      },
      { once: true }
    );

    document.head.appendChild(script);
  }).catch((error: unknown) => {
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

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
      console.warn("[GETTY EMBED] Missing required settings.", {
        id,
        hasSignature: Boolean(sig),
        hasItems: Boolean(items),
      });
      return;
    }

    let cancelled = false;

    const originalWidth = getPixels(width, 594);
    const originalHeight = getPixels(height, 396);

    const config: GettyWidgetConfig = {
      id,
      sig,
      items,
      w: `${originalWidth}px`,
      h: `${originalHeight}px`,
      caption,
      tld,
      is360,
    };

    /*
     * Keep the outer container responsive.
     * Getty controls the actual widget and iframe height.
     */
    container.style.display = "block";
    container.style.width = "100%";
    container.style.maxWidth = `${originalWidth}px`;
    container.style.minWidth = "0";
    container.style.height = "auto";
    container.style.minHeight = "0";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.border = "0";
    container.style.overflow = "visible";
    container.style.lineHeight = "normal";

    container.replaceChildren();

    const anchor = document.createElement("a");

    anchor.id = id;
    anchor.className = "gie-single";
    anchor.href =
      `https://www.gettyimages.${tld}/detail/${encodeURIComponent(items)}`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = "Embed from Getty Images";

    container.appendChild(anchor);

    loadGettyScript()
      .then(() => {
        if (cancelled) return;

        const loader = window.gie;

        if (!loader?.widgets?.load) {
          console.warn("[GETTY EMBED] Renderer unavailable.", { id });
          return;
        }

        try {
          /*
           * Do not manually resize the Getty iframe.
           * Its renderer controls the correct content height.
           */
          loader.widgets.load(config);
        } catch (error) {
          console.warn("[GETTY EMBED] Rendering failed.", {
            id,
            items,
            message:
              error instanceof Error
                ? error.message
                : String(error),
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.warn("[GETTY EMBED] Script unavailable.", error);
        }
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
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
        maxWidth: `${getPixels(width, 594)}px`,
        minWidth: 0,
        height: "auto",
        minHeight: 0,
        margin: 0,
        padding: 0,
        overflow: "visible",
        lineHeight: "normal",
        verticalAlign: "top",
      }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (root?: HTMLElement) => void;
      };
      ready?: (callback: () => void) => void;
    };
  }
}

interface XEmbedEnhancerProps {
  children: ReactNode;
  className?: string;
}

export default function XEmbedEnhancer({
  children,
  className,
}: XEmbedEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container?.querySelector("blockquote.twitter-tweet")) {
      return;
    }

    const renderEmbeds = () => {
      if (!containerRef.current || !window.twttr?.widgets?.load) {
        return;
      }

      window.twttr.widgets.load(containerRef.current);
    };

    if (window.twttr?.widgets?.load) {
      if (window.twttr.ready) {
        window.twttr.ready(renderEmbeds);
      } else {
        renderEmbeds();
      }
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );

    const handleLoad = () => {
      if (window.twttr?.ready) {
        window.twttr.ready(renderEmbeds);
      } else {
        renderEmbeds();
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.addEventListener("load", handleLoad, { once: true });
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      script?.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

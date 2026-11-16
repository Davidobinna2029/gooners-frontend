"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";

interface ArticleComment {
  id: string | number;
  author: string;
  date: string;
  content: string;
  pending?: boolean;
}

interface ArticleCommentsProps {
  postId: number;
}

type SortOrder = "newest" | "oldest";

const PAGE_SIZE = 10;
const MAX_LENGTH = 2000;
const STORAGE_KEY = "arsenaltalks-commenter";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ============================================================
   Scoped styles. Self-contained on purpose: they do not depend on
   Tailwind's theme. Dark mode follows a `.dark` class or
   `data-theme="dark"` on any ancestor (e.g. <html>).
============================================================ */

const STYLES = `
.atc{--atc-bg:#fff;--atc-fg:#0a0a0a;--atc-muted:#6b7280;--atc-soft:#f4f4f5;--atc-line:#e5e7eb;--atc-strong:#0a0a0a;--atc-red:#d10000;--atc-red-dark:#a80000;--atc-body:#27272a;margin-top:56px;padding-top:24px;border-top:4px solid var(--atc-strong);color:var(--atc-fg);font-size:16px;line-height:1.5}
.dark .atc,[data-theme="dark"] .atc{--atc-bg:#0b0b0c;--atc-fg:#f4f4f5;--atc-muted:#a1a1aa;--atc-soft:#18181b;--atc-line:#27272a;--atc-strong:#f4f4f5;--atc-body:#d4d4d8}
.atc *,.atc *::before,.atc *::after{box-sizing:border-box}
.atc button,.atc input,.atc textarea{font:inherit;color:inherit}
.atc-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px}
.atc-title{margin:0;padding-left:12px;border-left:4px solid var(--atc-red);font-size:26px;line-height:1.1;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.atc-count{margin-left:10px;font-size:16px;font-weight:700;color:var(--atc-muted)}
.atc-sort{display:inline-flex;border:1px solid var(--atc-line);border-radius:999px;overflow:hidden}
.atc-sort button{border:0;background:transparent;padding:8px 16px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--atc-muted);cursor:pointer}
.atc-sort button[aria-pressed="true"]{background:var(--atc-strong);color:var(--atc-bg)}
.atc-composer{margin-top:24px;border:1px solid var(--atc-line);border-radius:14px;padding:16px;background:var(--atc-bg);transition:border-color .15s,box-shadow .15s}
.atc-composer:focus-within{border-color:var(--atc-strong);box-shadow:0 0 0 3px rgba(209,0,0,.12)}
.atc-row{display:flex;gap:12px;align-items:flex-start}
.atc-avatar{flex:none;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;background:hsl(var(--h,0) 70% 92%);color:hsl(var(--h,0) 60% 30%)}
.dark .atc-avatar,[data-theme="dark"] .atc-avatar{background:hsl(var(--h,0) 40% 22%);color:hsl(var(--h,0) 80% 85%)}
.atc .atc-avatar.atc-avatar--me{background:var(--atc-strong);color:var(--atc-bg)}
.atc-main{flex:1;min-width:0}
.atc-textarea{display:block;width:100%;border:0;outline:0;resize:none;background:transparent;padding:0;font-size:16px;line-height:1.6}
.atc-textarea::placeholder{color:var(--atc-muted)}
.atc-fields{display:grid;gap:12px;grid-template-columns:1fr;margin-top:14px;padding-top:14px;border-top:1px solid var(--atc-line)}
@media (min-width:640px){.atc-fields{grid-template-columns:1fr 1fr}}
.atc-label{display:block;margin-bottom:4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--atc-muted)}
.atc-label small{margin-left:4px;font-size:11px;font-weight:400;letter-spacing:0;text-transform:none}
.atc-input{width:100%;border:1px solid var(--atc-line);border-radius:10px;background:var(--atc-bg);padding:10px 12px;font-size:14px}
.atc-input:focus{outline:0;border-color:var(--atc-red);box-shadow:0 0 0 3px rgba(209,0,0,.15)}
.atc-remember{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;color:var(--atc-muted)}
.atc-remember input{width:16px;height:16px;accent-color:var(--atc-red)}
.atc-alert{margin-top:14px;padding:10px 12px;border-radius:10px;font-size:14px;line-height:1.5}
.atc-alert--error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
.atc-alert--ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
.dark .atc-alert--error,[data-theme="dark"] .atc-alert--error{background:#2a1214;border-color:#5b1d22;color:#fca5a5}
.dark .atc-alert--ok,[data-theme="dark"] .atc-alert--ok{background:#0f2418;border-color:#1f4d33;color:#86efac}
.atc-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:14px}
.atc-hint{margin:0;font-size:12px;color:var(--atc-muted)}
.atc-hint .atc-warn{color:var(--atc-red);font-weight:700}
.atc-actions{display:flex;align-items:center;gap:8px}
.atc-btn{border:0;border-radius:999px;padding:9px 18px;font-size:14px;font-weight:700;cursor:pointer}
.atc-btn--ghost{background:transparent;color:var(--atc-muted)}
.atc-btn--ghost:hover{background:var(--atc-soft)}
.atc-btn--primary{min-height:40px;padding:9px 22px;background:var(--atc-red);color:#fff}
.atc-btn--primary:hover:not(:disabled){background:var(--atc-red-dark)}
.atc-btn:disabled{opacity:.5;cursor:not-allowed}
.atc-btn:focus-visible,.atc-sort button:focus-visible,.atc-more button:focus-visible{outline:2px solid var(--atc-red);outline-offset:2px}
.atc-list{list-style:none;margin:32px 0 0;padding:0}
.atc-item{padding:24px 0;border-top:1px solid var(--atc-line)}
.atc-item:first-child{border-top:0;padding-top:0}
.atc-item--pending{opacity:.85}
.atc-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}
.atc-author{margin:0;font-size:14px;font-weight:800;overflow-wrap:anywhere}
.atc-time{font-size:12px;font-weight:500;color:var(--atc-muted)}
.atc-badge{display:inline-block;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#fef3c7;color:#92400e}
.dark .atc-badge,[data-theme="dark"] .atc-badge{background:#3a2c0b;color:#fcd34d}
.atc-text{margin:8px 0 0;font-size:15px;line-height:1.75;color:var(--atc-body);white-space:pre-wrap;overflow-wrap:anywhere}
.atc-more{margin-top:8px;padding-top:24px;border-top:1px solid var(--atc-line);text-align:center}
.atc-more button{border:1px solid var(--atc-strong);border-radius:999px;background:transparent;color:var(--atc-strong);padding:10px 24px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.atc-more button:hover{background:var(--atc-strong);color:var(--atc-bg)}
.atc-empty{margin-top:32px;padding:40px 16px;border-top:1px solid var(--atc-line);border-bottom:1px solid var(--atc-line);text-align:center}
.atc-empty h3{margin:0;font-size:15px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.atc-empty p{margin:8px auto 0;max-width:360px;font-size:14px;color:var(--atc-muted)}
.atc-skel{display:flex;gap:16px;padding:24px 0;border-top:1px solid var(--atc-line)}
.atc-skel:first-child{border-top:0;padding-top:0}
.atc-skel-circle{flex:none;width:40px;height:40px;border-radius:50%;background:var(--atc-soft);animation:atc-pulse 1.4s ease-in-out infinite}
.atc-skel-lines{flex:1}
.atc-skel-bar{height:12px;margin-bottom:10px;border-radius:6px;background:var(--atc-soft);animation:atc-pulse 1.4s ease-in-out infinite}
@keyframes atc-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.atc-skel-circle,.atc-skel-bar{animation:none}}
.atc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

/* ============================================================
   Helpers
============================================================ */

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "A"
  );
}

function getHue(name: string) {
  let hash = 0;

  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) | 0;
  }

  return Math.abs(hash) % 360;
}

function formatRelativeTime(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - parsed.getTime()) / 1000)
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   Component
============================================================ */

export default function ArticleComments({ postId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [composerOpen, setComposerOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Restore a returning commenter's details (this device only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (typeof parsed?.name === "string") setName(parsed.name);
        if (typeof parsed?.email === "string") setEmail(parsed.email);
      }
    } catch {
      // Storage can be unavailable (private mode); the form still works.
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadComments() {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load comments.");
        }

        const data = await response.json();

        if (active) {
          setComments(Array.isArray(data.comments) ? data.comments : []);
        }
      } catch {
        if (active) {
          setLoadError(
            "Comments are temporarily unavailable. Please try again later."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (Number.isSafeInteger(postId) && postId > 0) {
      loadComments();
    } else {
      setLoading(false);
      setLoadError("Comments are temporarily unavailable.");
    }

    return () => {
      active = false;
    };
  }, [postId]);

  const approvedComments = useMemo(
    () => comments.filter((comment) => !comment.pending),
    [comments]
  );

  // The reader's own just-submitted comments, shown only to them until
  // a moderator approves them.
  const pendingComments = useMemo(
    () => comments.filter((comment) => comment.pending),
    [comments]
  );

  const sortedApproved = useMemo(() => {
    const copy = [...approvedComments];

    copy.sort((a, b) => {
      const difference =
        new Date(a.date).getTime() - new Date(b.date).getTime();

      return sort === "newest" ? -difference : difference;
    });

    return copy;
  }, [approvedComments, sort]);

  const visibleApproved = sortedApproved.slice(0, visibleCount);
  const remaining = sortedApproved.length - visibleApproved.length;
  const canSubmit = content.trim().length >= 3 && !submitting;
  const nearLimit = content.length > MAX_LENGTH - 200;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (content.trim().length < 3) {
      setError("Please write a comment before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Your comment could not be submitted.");
      }

      setComments((previous) => [
        {
          id: `pending-${Date.now()}`,
          author: name.trim(),
          date: new Date().toISOString(),
          content: content.trim(),
          pending: true,
        },
        ...previous,
      ]);

      try {
        if (remember) {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ name: name.trim(), email: email.trim() })
          );
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Ignore storage failures.
      }

      setMessage(
        data.message ||
          "Thanks! Your comment has been submitted and is awaiting moderation."
      );
      setContent("");
      setWebsite("");
      setComposerOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function renderComment(comment: ArticleComment) {
    const relativeTime = formatRelativeTime(comment.date);

    return (
      <li
        key={comment.id}
        className={`atc-item${comment.pending ? " atc-item--pending" : ""}`}
      >
        <article className="atc-row">
          <div
            aria-hidden="true"
            className="atc-avatar"
            style={{ ["--h" as string]: getHue(comment.author) }}
          >
            {getInitials(comment.author)}
          </div>

          <div className="atc-main">
            <header className="atc-meta">
              <h3 className="atc-author">{comment.author}</h3>

              {comment.pending ? (
                <span className="atc-badge">Awaiting moderation</span>
              ) : (
                relativeTime && (
                  <time className="atc-time" dateTime={comment.date}>
                    {relativeTime}
                  </time>
                )
              )}
            </header>

            <p className="atc-text">{comment.content}</p>
          </div>
        </article>
      </li>
    );
  }

  return (
    <section
      id="article-comments"
      className="atc"
      aria-labelledby="comments-heading"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ---------- Header ---------- */}
      <div className="atc-head">
        <h2 id="comments-heading" className="atc-title">
          Comments
          <span className="atc-count">{approvedComments.length}</span>
        </h2>

        {approvedComments.length > 1 && (
          <div className="atc-sort" role="group" aria-label="Sort comments">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                onClick={() => {
                  setSort(option);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {option === "newest" ? "Newest" : "Oldest"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Composer ---------- */}
      <form onSubmit={handleSubmit} className="atc-composer">
        <div className="atc-row">
          <div aria-hidden="true" className="atc-avatar atc-avatar--me">
            {name.trim() ? getInitials(name) : "?"}
          </div>

          <div className="atc-main">
            <label htmlFor="comment-content" className="atc-sr">
              Your comment
            </label>
            <textarea
              id="comment-content"
              className="atc-textarea"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onFocus={() => setComposerOpen(true)}
              onKeyDown={handleKeyDown}
              rows={composerOpen ? 4 : 2}
              maxLength={MAX_LENGTH}
              placeholder="Join the conversation…"
            />

            {composerOpen && (
              <>
                <div className="atc-fields">
                  <div>
                    <label htmlFor="comment-name" className="atc-label">
                      Name
                    </label>
                    <input
                      id="comment-name"
                      className="atc-input"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={60}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="comment-email" className="atc-label">
                      Email<small>(never shown)</small>
                    </label>
                    <input
                      id="comment-email"
                      className="atc-input"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      maxLength={254}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <label className="atc-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  Remember my name and email on this device
                </label>
              </>
            )}

            {/* Honeypot: hidden from readers, bots fill it in. */}
            <div className="atc-sr" aria-hidden="true">
              <label htmlFor="comment-website">Leave this field empty</label>
              <input
                id="comment-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            {error && (
              <p className="atc-alert atc-alert--error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p
                className="atc-alert atc-alert--ok"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            {composerOpen && (
              <div className="atc-bar">
                <p className="atc-hint">
                  <span className={nearLimit ? "atc-warn" : undefined}>
                    {content.length}/{MAX_LENGTH}
                  </span>
                  {" · "}Comments are reviewed before they appear. Ctrl+Enter
                  to post.
                </p>

                <div className="atc-actions">
                  <button
                    type="button"
                    className="atc-btn atc-btn--ghost"
                    onClick={() => {
                      setComposerOpen(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="atc-btn atc-btn--primary"
                    disabled={!canSubmit}
                  >
                    {submitting ? "Posting…" : "Post comment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* ---------- Comment list ---------- */}
      {loading ? (
        <ul
          className="atc-list"
          role="status"
          aria-live="polite"
          aria-label="Loading comments"
        >
          {[0, 1, 2].map((item) => (
            <li key={item} className="atc-skel">
              <div className="atc-skel-circle" />
              <div className="atc-skel-lines">
                <div className="atc-skel-bar" style={{ width: "30%" }} />
                <div className="atc-skel-bar" style={{ width: "100%" }} />
                <div className="atc-skel-bar" style={{ width: "65%" }} />
              </div>
            </li>
          ))}
        </ul>
      ) : loadError ? (
        <p className="atc-alert atc-alert--error" role="alert">
          {loadError}
        </p>
      ) : pendingComments.length + visibleApproved.length > 0 ? (
        <>
          <ol className="atc-list">
            {pendingComments.map(renderComment)}
            {visibleApproved.map(renderComment)}
          </ol>

          {remaining > 0 && (
            <div className="atc-more">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show {Math.min(remaining, PAGE_SIZE)} more{" "}
                {Math.min(remaining, PAGE_SIZE) === 1 ? "comment" : "comments"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="atc-empty">
          <h3>No comments yet</h3>
          <p>Be the first to share your thoughts on this story.</p>
        </div>
      )}
    </section>
  );
}
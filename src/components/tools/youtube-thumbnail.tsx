"use client";

import { useState } from "react";
import { Download, Link2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Resolution = {
  key: string;
  label: string;
  size: string;
  width: number;
  height: number;
};

// Ordered from highest to lowest quality.
const RESOLUTIONS: Resolution[] = [
  { key: "maxresdefault", label: "Max / HD", size: "1280×720", width: 1280, height: 720 },
  { key: "sddefault", label: "Standard", size: "640×480", width: 640, height: 480 },
  { key: "hqdefault", label: "High", size: "480×360", width: 480, height: 360 },
  { key: "mqdefault", label: "Medium", size: "320×180", width: 320, height: 180 },
  { key: "default", label: "Default", size: "120×90", width: 120, height: 90 },
];

/** Extract an 11-character YouTube video ID from many URL shapes (or a bare ID). */
function parseVideoId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Bare 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      // watch?v=ID
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // /shorts/ID, /embed/ID, /v/ID, /live/ID
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) =>
        ["shorts", "embed", "v", "live"].includes(p)
      );
      if (idx !== -1 && parts[idx + 1]) {
        const id = parts[idx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function thumbUrl(videoId: string, key: string): string {
  return `https://i.ytimg.com/vi/${videoId}/${key}.jpg`;
}

export function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // resolutions that failed to load (don't exist for this video)
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = parseVideoId(url);
    if (!id) {
      setVideoId(null);
      setError(
        "That doesn't look like a valid YouTube link. Paste a full video URL or video ID."
      );
      return;
    }
    setError(null);
    setUnavailable(new Set());
    setVideoId(id);
  };

  const markUnavailable = (key: string) =>
    setUnavailable((prev) => new Set(prev).add(key));

  const download = async (key: string) => {
    if (!videoId) return;
    setDownloading(key);
    const src = thumbUrl(videoId, key);
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error("not ok");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${videoId}-${key}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("Thumbnail downloaded");
    } catch {
      // Fallback: open in a new tab so the user can save manually
      window.open(src, "_blank", "noopener,noreferrer");
      toast.info("Opened the image in a new tab — right-click to save it.");
    } finally {
      setDownloading(null);
    }
  };

  const visibleResolutions = RESOLUTIONS.filter(
    (r) => !unavailable.has(r.key)
  );

  return (
    <div className="space-y-8">
      {/* Input */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a YouTube link, e.g. https://youtu.be/dQw4w9WgXcQ"
              className="pl-9"
              aria-label="YouTube video URL"
            />
          </div>
          <Button type="submit" className="sm:w-auto">
            Get thumbnails
          </Button>
        </form>
        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </p>
        )}
      </Card>

      {/* Results */}
      {videoId && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Available thumbnails</h2>
            <span className="text-sm text-muted-foreground">
              Video ID: <span className="font-mono">{videoId}</span>
            </span>
          </div>

          {visibleResolutions.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No thumbnails could be loaded for this video. Double-check the
              link and try again.
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {visibleResolutions.map((res) => (
                <Card key={res.key} className="overflow-hidden p-0">
                  <div className="relative aspect-video bg-muted">
                    {/* Use a plain img: YouTube CDN is external and we toggle
                        visibility based on the natural load result. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl(videoId, res.key)}
                      alt={`${res.label} thumbnail`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={() => markUnavailable(res.key)}
                      onLoad={(e) => {
                        // YouTube returns a 120x90 gray placeholder when a
                        // resolution is missing — treat that as unavailable
                        // for the larger sizes.
                        const img = e.currentTarget;
                        if (
                          res.key !== "default" &&
                          img.naturalWidth <= 120 &&
                          img.naturalHeight <= 90
                        ) {
                          markUnavailable(res.key);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{res.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {res.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Open in new tab"
                        render={
                          <a
                            href={thumbUrl(videoId, res.key)}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => download(res.key)}
                        disabled={downloading === res.key}
                      >
                        <Download className="size-4" />
                        {downloading === res.key ? "Saving…" : "Download"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!videoId && !error && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Paste any YouTube link above to preview and download its thumbnails.
          Works with normal, youtu.be, Shorts and embed URLs.
        </div>
      )}
    </div>
  );
}

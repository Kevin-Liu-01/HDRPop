/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AlertCircle,
  Bell,
  ChevronsLeftRight,
  Check,
  Clipboard,
  Download,
  Home,
  ImagePlus,
  Link2,
  LoaderCircle,
  MessageCircle,
  MonitorUp,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { embedIccProfile } from "@/lib/icc";

type InputMode = "upload" | "link" | "paste";

type Preview = {
  name: string;
  label: string;
  width: number;
  height: number;
  sourceBytes: number;
  outputBytes: number;
  sdrUrl: string;
  hdrUrl: string;
  hdrBlob: Blob;
};

const MAX_LOCAL_BYTES = 30 * 1024 * 1024;
const MAX_DIMENSION = 2400;
let profilePromise: Promise<ArrayBuffer> | null = null;

function profileData() {
  profilePromise ??= fetch("/rec2020-pq.icc").then((response) => {
    if (!response.ok) throw new Error("The HDR color profile could not be loaded.");
    return response.arrayBuffer();
  });
  return profilePromise;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function outputName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "image";
  return `${base}-hdr-pop.jpg`;
}

function displayName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .slice(0, 36) || "Your Company";
}

async function normalizeHeic(blob: Blob, name: string): Promise<Blob> {
  const isHeic = /hei[cf]/i.test(blob.type) || /\.hei[cf]$/i.test(name);
  if (!isHeic) return blob;

  const { default: heic2any } = await import("heic2any");
  const result = await heic2any({ blob, toType: "image/png", quality: 0.96 });
  return Array.isArray(result) ? result[0] : result;
}

async function renderJpeg(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();

    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    if (!sourceWidth || !sourceHeight) throw new Error("That image has no readable pixels.");

    const scale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Your browser could not start the image canvas.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    const jpeg = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error("The JPEG encoder returned no image.")),
        "image/jpeg",
        0.95,
      );
    });

    return { jpeg, width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function HdrStudio() {
  const [mode, setMode] = useState<InputMode>("upload");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [hdrDetected, setHdrDetected] = useState<boolean | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const activeUrls = useRef<string[]>([]);
  const initialized = useRef(false);

  const processBlob = useCallback(async (incomingBlob: Blob, name: string) => {
    setBusy(true);
    setError("");
    setCopied(false);

    try {
      if (incomingBlob.size > MAX_LOCAL_BYTES) throw new Error("Keep local images under 30 MB.");
      const sourceBlob = await normalizeHeic(incomingBlob, name);
      const [{ jpeg, width, height }, icc] = await Promise.all([renderJpeg(sourceBlob), profileData()]);
      const hdrBytes = embedIccProfile(await jpeg.arrayBuffer(), icc);
      const hdrBuffer = new ArrayBuffer(hdrBytes.byteLength);
      new Uint8Array(hdrBuffer).set(hdrBytes);
      const hdrBlob = new Blob([hdrBuffer], { type: "image/jpeg" });
      const sdrUrl = URL.createObjectURL(jpeg);
      const hdrUrl = URL.createObjectURL(hdrBlob);
      const previousUrls = activeUrls.current;

      activeUrls.current = [sdrUrl, hdrUrl];
      setPreview({
        name: outputName(name),
        label: displayName(name),
        width,
        height,
        sourceBytes: incomingBlob.size,
        outputBytes: hdrBlob.size,
        sdrUrl,
        hdrUrl,
        hdrBlob,
      });
      previousUrls.forEach((url) => URL.revokeObjectURL(url));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "That picture could not be converted.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(dynamic-range: high)");
    const update = () => setHdrDetected(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch("/ghost-source.png")
      .then((response) => response.blob())
      .then((blob) => processBlob(blob, "ghost-source.png"))
      .catch(() => undefined);
  }, [processBlob]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const imageItem = Array.from(event.clipboardData?.items ?? []).find((item) => item.type.startsWith("image/"));
      const file = imageItem?.getAsFile();
      if (!file) return;
      event.preventDefault();
      setMode("paste");
      void processBlob(file, file.name || `pasted-${Date.now()}.png`);
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [processBlob]);

  useEffect(() => () => activeUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const acceptFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.hei[cf]$/i.test(file.name)) {
      setError("Choose an image file: JPEG, PNG, WebP, GIF, HEIC, or HEIF.");
      return;
    }
    void processBlob(file, file.name || "upload.jpg");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const loadUrl = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      setError("Paste a public image link first.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/image?url=${encodeURIComponent(trimmed)}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "That image could not be fetched." }));
        throw new Error(payload.error);
      }
      const blob = await response.blob();
      const pathName = new URL(trimmed).pathname.split("/").filter(Boolean).pop() || "linked-image.jpg";
      await processBlob(blob, pathName);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That image could not be fetched.");
      setBusy(false);
    }
  };

  const copyResult = async () => {
    if (!preview || !navigator.clipboard?.write) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/jpeg": preview.hdrBlob })]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("This browser blocked image copying. Download still works.");
    }
  };

  const updateComparisonFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    setComparePosition(Math.min(100, Math.max(0, position)));
  };

  return (
    <section className="studio" id="make">
      <header className="demo-toolbar">
        <h2>Try it with any image</h2>
        <div className={`display-badge ${hdrDetected ? "is-high" : ""}`}>
          <MonitorUp size={16} />
          <span>
            <small>DISPLAY CHECK</small>
            <strong>{hdrDetected === null ? "Checking…" : hdrDetected ? "HDR headroom detected" : "HDR support not detected"}</strong>
          </span>
        </div>
      </header>

      <div className="studio-grid">
        <aside className="input-panel">
          <div className="mode-tabs" role="tablist" aria-label="Image input method">
            <button className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")} role="tab" aria-selected={mode === "upload"}>
              <UploadCloud size={15} /> Upload
            </button>
            <button className={mode === "link" ? "active" : ""} onClick={() => setMode("link")} role="tab" aria-selected={mode === "link"}>
              <Link2 size={15} /> Link
            </button>
            <button className={mode === "paste" ? "active" : ""} onClick={() => setMode("paste")} role="tab" aria-selected={mode === "paste"}>
              <Clipboard size={15} /> Paste
            </button>
          </div>

          <div className="input-body">
            {mode === "upload" && (
              <div
                className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
                onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <input ref={fileInput} type="file" accept="image/*,.heic,.heif" onChange={onFileChange} hidden />
                <div className="drop-icon"><ImagePlus size={24} /></div>
                <strong>Drop a picture here</strong>
                <p>JPEG, PNG, WebP, GIF, HEIC or HEIF · 30 MB max</p>
                <button className="white-button" onClick={() => fileInput.current?.click()}>Choose an image</button>
              </div>
            )}

            {mode === "link" && (
              <form className="link-form" onSubmit={loadUrl}>
                <div className="link-icon"><Link2 size={22} /></div>
                <strong>Paste a direct image link</strong>
                <p>We fetch public images through a guarded proxy, then process them locally.</p>
                <label>
                  <span className="sr-only">Image URL</span>
                  <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/image.jpg" inputMode="url" />
                </label>
                <button className="white-button" type="submit">Fetch & convert</button>
              </form>
            )}

            {mode === "paste" && (
              <div className="paste-zone">
                <div className="paste-keys" aria-hidden="true"><kbd>⌘</kbd><span>+</span><kbd>V</kbd></div>
                <strong>Paste from your clipboard</strong>
                <p>Copy an image from Preview, Finder, Photoshop, or the web, then paste anywhere on this page.</p>
                <span className="listening"><i /> Listening for an image</span>
              </div>
            )}
          </div>

          <div className="privacy-note mono-label">
            <span>LOCAL-FIRST</span>
            <span>NO UPLOAD STORAGE</span>
          </div>
        </aside>

        <div className="result-panel" aria-live="polite">
          <div className="result-topline">
            <span>Drag anywhere on the image to compare</span>
            {preview && <span className="result-ready"><Check size={13} /> PQ TAGGED</span>}
          </div>

          {busy ? (
            <div className="result-empty">
              <LoaderCircle className="spin" size={30} />
              <strong>Teaching pixels a new trick…</strong>
              <p>Rendering JPEG and attaching the Rec.2020/PQ profile.</p>
            </div>
          ) : preview ? (
            <>
              <div
                className="comparison-slider"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  updateComparisonFromPointer(event);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) updateComparisonFromPointer(event);
                }}
                onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
                onPointerCancel={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onDragStart={(event) => event.preventDefault()}
              >
                <div className="comparison-image comparison-sdr">
                  <img className="sdr-asset" src={preview.sdrUrl} alt="Standard dynamic range preview" draggable={false} />
                </div>
                <div
                  className="comparison-image comparison-hdr"
                  style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
                >
                  <img className="hdr-asset" src={preview.hdrUrl} alt="HDR converted preview" draggable={false} />
                </div>
                <span className="comparison-label comparison-label-hdr">HDR</span>
                <span className="comparison-label comparison-label-sdr">SDR</span>
                <div className="comparison-divider" style={{ left: `${comparePosition}%` }} aria-hidden="true">
                  <span><ChevronsLeftRight size={19} /></span>
                </div>
              </div>

              <div className="comparison-caption">
                <span><strong>HDR</strong> Rec.2020 / PQ</span>
                <span><strong>SDR</strong> Ordinary JPEG</span>
              </div>

              <div className="comparison-controls">
                <button type="button" onClick={() => setComparePosition(0)}>Full SDR</button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparePosition}
                  onInput={(event) => setComparePosition(Number(event.currentTarget.value))}
                  onChange={(event) => setComparePosition(Number(event.target.value))}
                  aria-label="Reveal HDR version"
                />
                <output>{Math.round(comparePosition)}% HDR</output>
                <button type="button" onClick={() => setComparePosition(100)}>Full HDR</button>
              </div>

              <div className="file-meta">
                <span>{preview.width} × {preview.height} PX</span>
                <span>{formatBytes(preview.sourceBytes)} → {formatBytes(preview.outputBytes)}</span>
              </div>

              <div className="result-actions">
                <a className="white-button" href={preview.hdrUrl} download={preview.name}>
                  <Download size={16} /> Download HDR JPEG
                </a>
                <button className="ghost-button" onClick={copyResult}>
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                  {copied ? "Copied" : "Copy image"}
                </button>
              </div>
            </>
          ) : (
            <div className="result-empty">
              <Sparkles size={30} />
              <strong>Your comparison appears here</strong>
              <p>The left image gets PQ signaling. The right shows the SDR fallback.</p>
            </div>
          )}

          {error && <div className="error-message"><AlertCircle size={16} /><span>{error}</span></div>}
        </div>
      </div>

      <p className="mac-note">
        <MonitorUp size={17} />
        <span><strong>Open this page on a Mac, iPhone, or iPad with an XDR display to see the difference.</strong> A screenshot tone-maps both images and usually makes them look identical.</span>
      </p>

      <section className="proof" id="proof">
        <header className="proof-heading">
          <div>
            <h2>Now scroll it through a normal white page.</h2>
            <p>The converted image is live below. On a compatible display, its white can sit above the white of the interface.</p>
          </div>
        </header>

        <div className="linkedin-frame">
          <div className="linkedin-topbar">
            <div className="linkedin-inner">
              <span className="linkedin-logo">in</span>
              <div className="linkedin-search"><Search size={16} /><span>Search</span></div>
              <div className="linkedin-navicons" aria-hidden="true">
                <span><Home /><small>Home</small></span>
                <span><MessageCircle /><small>Messaging</small></span>
                <span><Bell /><small>Notifications</small></span>
              </div>
            </div>
          </div>

          <div className="linkedin-page">
            <section className="linkedin-profile-card" aria-label="Maya Chen profile summary">
              <div className="linkedin-profile-cover" aria-hidden="true">
                <span>HDR/POP</span>
              </div>
              <div className="linkedin-profile-body">
                <img className="linkedin-profile-avatar hdr-asset" src="/hdr-pop-logo-hdr.jpg" alt="Maya Chen" />
                <div className="linkedin-profile-actions">
                  <button type="button" className="linkedin-action linkedin-action-quiet">More</button>
                  <button type="button" className="linkedin-action linkedin-action-outline">Visit my website</button>
                  <button type="button" className="linkedin-action linkedin-action-outline">Message</button>
                  <a className="linkedin-action linkedin-action-primary" href="https://www.linkedin.com/in/jackyhuang13/" target="_blank" rel="noreferrer">Connect</a>
                </div>
                <h3>Maya Chen</h3>
                <p className="linkedin-profile-tagline">HDR/POP</p>
                <p className="linkedin-profile-location">San Francisco, California · <a href="https://www.linkedin.com/in/jackyhuang13/" target="_blank" rel="noreferrer">Contact info</a></p>
                <p className="linkedin-profile-count">500+ connections</p>
              </div>
            </section>

            <div className="experience-card">
              <h3>Experience</h3>
              <div className="experience-row">
                <div className="company-logo-stage">
                  {preview ? <img className="hdr-asset" src={preview.hdrUrl} alt="Converted company logo" /> : <Sparkles />}
                </div>
                <div className="experience-copy">
                  <h4>Head of Glow</h4>
                  <p>{preview?.label ?? "Your Company"}</p>
                  <span>Aug 2026 – Present · 1 mo</span>
                  <p className="experience-description">A single logo using more brightness than the interface around it.</p>
                </div>
              </div>
            </div>

            <div className="linkedin-disclaimer">
              LinkedIn-style UI study · not affiliated with LinkedIn · structure inspired by the MIT-licensed Netly project
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_REDIRECTS = 3;

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase();

  if (normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  const mapped = normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
  if (isIP(mapped) !== 4) return false;

  const [a, b] = mapped.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

async function assertPublicUrl(url: URL): Promise<void> {
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Only public http(s) image links are supported.");
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("Local network addresses are not supported.");
  }

  const results = await lookup(hostname, { all: true, verbatim: true });
  if (!results.length || results.some((result) => isPrivateAddress(result.address))) {
    throw new Error("That link resolves to a private network address.");
  }
}

async function fetchPublicImage(initialUrl: URL): Promise<Response> {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertPublicUrl(currentUrl);

    const response = await fetch(currentUrl, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
        "User-Agent": "HDR-Pop/1.0 image preview",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new Error("The image link redirected too many times.");
      }
      currentUrl = new URL(location, currentUrl);
      continue;
    }

    if (!response.ok) {
      throw new Error(`The image host returned ${response.status}.`);
    }

    return response;
  }

  throw new Error("The image link could not be resolved.");
}

export async function GET(request: NextRequest) {
  try {
    const rawUrl = request.nextUrl.searchParams.get("url")?.trim();
    if (!rawUrl) {
      return NextResponse.json({ error: "Paste a public image URL first." }, { status: 400 });
    }

    const sourceUrl = new URL(rawUrl);
    const upstream = await fetchPublicImage(sourceUrl);
    const contentType = upstream.headers.get("content-type")?.split(";")[0].trim() ?? "";
    const declaredLength = Number(upstream.headers.get("content-length") ?? 0);

    if (!contentType.startsWith("image/")) {
      throw new Error("That URL did not return an image.");
    }
    if (declaredLength > MAX_BYTES) {
      throw new Error("That image is larger than 15 MB.");
    }

    const body = new Uint8Array(await upstream.arrayBuffer());
    if (body.byteLength > MAX_BYTES) {
      throw new Error("That image is larger than 15 MB.");
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "That image could not be loaded.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

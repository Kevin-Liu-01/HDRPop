import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { embedIccProfile } from "../lib/icc.ts";

function exactArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const sourceUrl = process.argv[2]
  ? pathToFileURL(resolve(process.argv[2]))
  : new URL("../public/hdr-pop-logo-source.jpg", import.meta.url);
const outputUrl = process.argv[3]
  ? pathToFileURL(resolve(process.argv[3]))
  : new URL("../public/hdr-pop-logo-hdr.jpg", import.meta.url);

const jpeg = await readFile(sourceUrl);
const profile = await readFile(new URL("../public/rec2020-pq.icc", import.meta.url));
const result = embedIccProfile(exactArrayBuffer(jpeg), exactArrayBuffer(profile));

await writeFile(outputUrl, result);

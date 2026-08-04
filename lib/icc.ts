const ICC_LABEL = new Uint8Array([
  0x49, 0x43, 0x43, 0x5f, 0x50, 0x52,
  0x4f, 0x46, 0x49, 0x4c, 0x45, 0x00,
]);

const MAX_PROFILE_CHUNK = 65_519;

function concat(parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }

  return output;
}

function isIccSegment(bytes: Uint8Array, start: number, end: number): boolean {
  if (bytes[start] !== 0xff || bytes[start + 1] !== 0xe2) return false;
  const payloadStart = start + 4;
  if (end - payloadStart < ICC_LABEL.length + 2) return false;

  return ICC_LABEL.every((value, index) => bytes[payloadStart + index] === value);
}

function stripEmbeddedIcc(bytes: Uint8Array): Uint8Array {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("The browser did not produce a valid JPEG.");
  }

  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let cursor = 2;

  while (cursor < bytes.length) {
    if (bytes[cursor] !== 0xff || cursor + 1 >= bytes.length) {
      parts.push(bytes.slice(cursor));
      break;
    }

    const marker = bytes[cursor + 1];
    if (marker === 0xda || marker === 0xd9) {
      parts.push(bytes.slice(cursor));
      break;
    }

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(bytes.slice(cursor, cursor + 2));
      cursor += 2;
      continue;
    }

    if (cursor + 3 >= bytes.length) {
      throw new Error("The JPEG marker table is truncated.");
    }

    const markerLength = (bytes[cursor + 2] << 8) | bytes[cursor + 3];
    const segmentEnd = cursor + markerLength + 2;

    if (markerLength < 2 || segmentEnd > bytes.length) {
      throw new Error("The JPEG marker table is invalid.");
    }

    if (!isIccSegment(bytes, cursor, segmentEnd)) {
      parts.push(bytes.slice(cursor, segmentEnd));
    }

    cursor = segmentEnd;
  }

  return concat(parts);
}

function makeIccSegments(profile: Uint8Array): Uint8Array[] {
  const count = Math.ceil(profile.length / MAX_PROFILE_CHUNK);
  if (count > 255) throw new Error("The ICC profile is too large for JPEG.");

  return Array.from({ length: count }, (_, index) => {
    const chunk = profile.slice(
      index * MAX_PROFILE_CHUNK,
      Math.min(profile.length, (index + 1) * MAX_PROFILE_CHUNK),
    );
    const payloadLength = ICC_LABEL.length + 2 + chunk.length;
    const segmentLength = payloadLength + 2;
    const segment = new Uint8Array(payloadLength + 4);

    segment[0] = 0xff;
    segment[1] = 0xe2;
    segment[2] = (segmentLength >> 8) & 0xff;
    segment[3] = segmentLength & 0xff;
    segment.set(ICC_LABEL, 4);
    segment[4 + ICC_LABEL.length] = index + 1;
    segment[5 + ICC_LABEL.length] = count;
    segment.set(chunk, 6 + ICC_LABEL.length);

    return segment;
  });
}

export function embedIccProfile(
  jpegInput: ArrayBuffer | Uint8Array,
  profileInput: ArrayBuffer | Uint8Array,
): Uint8Array {
  const jpeg = jpegInput instanceof Uint8Array ? jpegInput : new Uint8Array(jpegInput);
  const profile = profileInput instanceof Uint8Array ? profileInput : new Uint8Array(profileInput);
  const cleanJpeg = stripEmbeddedIcc(jpeg);
  const iccSegments = makeIccSegments(profile);

  return concat([cleanJpeg.slice(0, 2), ...iccSegments, cleanJpeg.slice(2)]);
}

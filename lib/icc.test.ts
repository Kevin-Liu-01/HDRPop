import { describe, expect, it } from "vitest";
import { embedIccProfile } from "./icc";

const ICC_LABEL = [
  0x49, 0x43, 0x43, 0x5f, 0x50, 0x52,
  0x4f, 0x46, 0x49, 0x4c, 0x45, 0x00,
];

describe("embedIccProfile", () => {
  it("injects an ICC APP2 marker and keeps the JPEG payload", () => {
    const jpeg = new Uint8Array([
      0xff, 0xd8,
      0xff, 0xe0, 0x00, 0x04, 0x12, 0x34,
      0xff, 0xda, 0x00, 0x02,
      0x99, 0x88,
      0xff, 0xd9,
    ]);
    const profile = new Uint8Array([1, 2, 3, 4]);

    const result = embedIccProfile(jpeg, profile);

    expect(Array.from(result.slice(0, 4))).toEqual([0xff, 0xd8, 0xff, 0xe2]);
    expect(Array.from(result.slice(6, 18))).toEqual(ICC_LABEL);
    expect(Array.from(result.slice(20, 24))).toEqual([1, 2, 3, 4]);
    expect(Array.from(result.slice(-10))).toEqual(Array.from(jpeg.slice(-10)));
  });

  it("replaces an existing ICC marker instead of stacking profiles", () => {
    const first = embedIccProfile(
      new Uint8Array([0xff, 0xd8, 0xff, 0xda, 0x00, 0x02, 0xff, 0xd9]),
      new Uint8Array([7, 7, 7]),
    );
    const result = embedIccProfile(first, new Uint8Array([8, 8]));
    const label = new TextDecoder().decode(result);

    expect(label.match(/ICC_PROFILE/g)).toHaveLength(1);
  });
});

import { describe, expect, test } from "bun:test";
import {
  makeTvLink,
  createEpisodeButtons,
  createSeasonButtons
} from "../1337x/1337xButtons.user.js";

describe("makeTvLink", () => {
  test("pads single digit episode and season numbers", () => {
    const result = makeTvLink("TestShow", 1, 1);
    expect(result).toBe("TestShow S01E01");
  });

  test("handles double-digit values without additional padding", () => {
    const result = makeTvLink("TestShow", 10, 10);
    expect(result).toBe("TestShow S10E10");
  });

  test("accepts numeric strings by converting them correctly", () => {
    const result = makeTvLink("TestShow", "3", "4");
    expect(result).toBe("TestShow S04E03");
  });
});

describe("createEpisodeButtons", () => {
  test("returns HTML string with episode navigation elements", () => {
    const html = createEpisodeButtons("TestShow", "1", "1");
    expect(html).toContain("Episodes:");
    expect(html).toContain("⏮");
    expect(html).toContain("◀");
    expect(html).toContain("▶");
  });
});

describe("createSeasonButtons", () => {
  test("returns HTML string with season navigation elements", () => {
    const html = createSeasonButtons("TestShow", "1", "1");
    expect(html).toContain("Seasons:");
    expect(html).toContain("⏮");
    expect(html).toContain("◀");
    expect(html).toContain("▶");
  });
}); 
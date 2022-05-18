import { assertArrayIncludes, assertMatch } from "./../deps.ts";

export const getPatterns = (ft: string): string[] => {
  return [
    `**/snippets/${ft}.snippets`,
    `**/snippets/${ft}/*.snippets`,
    `**/snippets/${ft}/*.snippet`,
    `**/snippets/${ft}*/*.snippet`,
  ];
};

Deno.test("contain snipmate file path", () => {
  const patterns = getPatterns("javascript");
  assertArrayIncludes(patterns, []);
  patterns.forEach((pattern) => {
    assertMatch(pattern, /snippets/);
  });
});

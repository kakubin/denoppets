import { assertEquals } from "./deps.ts";

export class Snippet {
  readonly trigger: string;
  value: string[];
  priority = 0;
  description?: string;

  constructor(
    trigger: string,
    value: string[] = [],
  ) {
    this.trigger = trigger;
    this.value = value;
  }

  matches(triger: string): boolean {
    return this.trigger == triger;
  }
}

Deno.test("matches", () => {
  const snippet = new Snippet("trigger", []);
  assertEquals(snippet.matches("trigger"), true);
  assertEquals(snippet.matches("non_trigger"), false);
});

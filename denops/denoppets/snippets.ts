import { Snippet } from "./snippet.ts";
import { assertEquals } from "./deps.ts";

export class Snippets {
  snippets: Snippet[] = [];

  addSnippet(snippets: Snippet[]) {
    this.snippets.push(...snippets);
    this.sort();
  }

  match(trigger: string): Snippet[] {
    return this.snippets.filter((snippet) => snippet.matches(trigger));
  }

  sort() {
    this.snippets.sort((a, b) => b.priority - a.priority);
  }
}

Deno.test("addSnippet", () => {
  const snippets = new Snippets();
  assertEquals(snippets.snippets.length, 0);

  const snippetA = new Snippet("a", []);
  snippets.addSnippet([snippetA]);
  assertEquals(snippets.snippets.length, 1);

  const snippetB = new Snippet("b", []);
  snippets.addSnippet([snippetB]);
  assertEquals(snippets.snippets.length, 2);
});

Deno.test("sort", () => {
  const snippets = new Snippets();
  const snippetA = new Snippet("a", []);
  const snippetB = new Snippet("b", []);
  snippetB.priority = 100;
  snippets.addSnippet([snippetA, snippetB]);

  assertEquals(snippets.snippets, [snippetB, snippetA]);
});

Deno.test("match", () => {
  const snippets = new Snippets();
  const snippetA = new Snippet("a", []);
  const snippetB = new Snippet("b", []);

  snippets.addSnippet([snippetA, snippetB]);

  assertEquals(snippets.match("a"), [snippetA]);
  assertEquals(snippets.match("no_match"), []);
});

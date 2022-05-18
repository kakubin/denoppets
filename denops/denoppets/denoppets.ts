import { Snipmate } from "./sources/snipmate.ts";
import { Snippet } from "./snippet.ts";

export class Denoppets {
  private snippetsSources: Snipmate[];

  constructor(rtp: string[]) {
    this.snippetsSources = [new Snipmate(rtp)];
  }

  registerSnippetsFor(filetypes: string[]) {
    this.snippetsSources.forEach((source) => {
      source.registerSnippets(filetypes);
    });
  }

  currentSnippets(
    filetypes: string[],
  ): { trigger: string; description?: string }[] {
    return this.snippetsSources.flatMap((source) => {
      return source.getSnippetsFor(filetypes);
    });
  }

  findSnippet(filetypes: string[], input: string): Snippet | undefined {
    return this.snippetsSources[0].getSnippetFor(filetypes, input);
  }
}

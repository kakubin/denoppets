import { ExpandGlobOptions, expandGlobSync } from "./deps.ts";
import { SnippetType } from "./types.ts";
import { getPatterns as getSnipmatePatterns } from "./filer/snipmate.ts";

const defaultOption = { includeDirs: false };

export class Filer {
  rtp: string[];

  constructor(rtp: string[]) {
    this.rtp = rtp;
  }

  getAllFilesFor(snippetType: SnippetType, ft: string): string[] {
    const patterns: string[] = this.getPattern(snippetType, ft);
    const results: string[] = [];
    for (const path of this.rtp) {
      if (!(/snippet/.test(path))) continue;

      const option: ExpandGlobOptions = {
        ...defaultOption,
        root: path,
      };

      patterns.forEach((pattern) => {
        for (const file of expandGlobSync(pattern, option)) {
          results.push(file.path);
        }
      });
    }

    return results;
  }

  getPattern(snippetType: SnippetType, ft: string): string[] {
    if (snippetType === "snipmate") {
      return getSnipmatePatterns(ft);
    }

    throw new Error("");
  }
}

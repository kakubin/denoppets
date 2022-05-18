import { SearchResults, TokenWithFilename } from "./../types.ts";
import { Snippets } from "./../snippets.ts";
import { Snippet } from "./../snippet.ts";
import { Filer } from "./../filer.ts";
import { Collector } from "./../collector.ts";

type SnipDict = {
  [filename: string]: Snippets;
};

type Store = {
  filenames: string[];
  extensions: string[];
};

export class Snipmate {
  private snipDict: SnipDict = {};
  private filer: Filer;
  private extensions: Record<string, Store> = {};

  constructor(rtp: string[]) {
    this.filer = new Filer(rtp);
    this.registerSnippets(["_"]);
  }

  registerSnippets(filetypes: string[]) {
    for (const filetype of filetypes) {
      if (filetype && filetype in this.extensions) continue;

      const searchResults = new Collector(this.filer, "snipmate")
        .getSnippetsFor(filetype);

      this._registerSnippets(searchResults);
    }
  }
  _registerSnippets(searchResults: SearchResults) {
    const filenames = searchResults.tokens.map((token) => token.filename);
    const extensions = searchResults.tokens.flatMap((token) => {
      return token.extensions || [];
    });
    this.extensions[searchResults.searchKey] = { filenames, extensions };

    searchResults.tokens.forEach((token) => {
      if (!(token.filename in this.snipDict)) {
        this._addSnippetsFor(token);
      }
      if (token.extensionSearchResults) {
        token.extensionSearchResults.forEach((child) => {
          this._registerSnippets(child);
        });
      }
    });
  }

  _addSnippetsFor(token: TokenWithFilename) {
    this.snipDict[token.filename] = new Snippets();
    this.snipDict[token.filename].addSnippet(token.snippets);
  }

  getSnippetsFor(filetypes: string[]): Snippet[] {
    return this.allExistingFilenames(filetypes).flatMap((filetype) => {
      return this.snipDict[filetype].snippets;
    });
  }

  getSnippetFor(filetypes: string[], trigger: string): Snippet | undefined {
    return this.allExistingFilenames(filetypes).flatMap((filetype) => {
      const snips = this.snipDict[filetype];
      return snips.match(trigger);
    })[0];
  }

  allExistingFilenames(filetypes: string[]): string[] {
    const filenames = this._allFilenames(filetypes);
    filenames.unshift("_");
    return filenames;
  }

  _allFilenames(filetypes: string[]): string[] {
    const seen: Set<string> = new Set();
    const todoFts = Array.from(filetypes);

    while (todoFts.length > 0) {
      const todoFt = todoFts.pop() as string;
      if (todoFt in this.extensions) {
        const store = this.extensions[todoFt];

        store.filenames.forEach((filename) => {
          seen.add(filename);
        });

        todoFts.push(...store.extensions);
      }
    }

    return [...seen];
  }
}

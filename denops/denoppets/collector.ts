import { Filer } from "./filer.ts";
import { SearchResults, SnippetType, Token } from "./types.ts";
import { parse as parseSnipmate } from "./parsing/snipmate.ts";

const readFile = (filepath: string): string => {
  return Deno.readTextFileSync(filepath);
};

export class Collector {
  private filer: Filer;
  private snippetType: SnippetType;

  constructor(filer: Filer, snippetType: SnippetType) {
    this.filer = filer;
    this.snippetType = snippetType;
  }

  getSnippetsFor(filetype: string): SearchResults {
    const searchResults: SearchResults = { searchKey: filetype, tokens: [] };
    const filenameRegex = /([^\/]*)\.snippets?/;

    const filepaths = this.filer.getAllFilesFor(this.snippetType, filetype);
    for (const filepath of filepaths) {
      const matchResult = filepath.match(filenameRegex);
      let filename: string;
      if (matchResult) {
        filename = matchResult[1];
      } else {
        continue;
      }

      searchResults.tokens.push({
        ...this._collectFileTokenWithSearchResult(filepath),
        filename: filename,
      });
    }

    return searchResults;
  }

  _collectFileTokenWithSearchResult(filepath: string): Token {
    const fileContents = readFile(filepath);
    const token = this.parse(fileContents);

    if (token.extensions) {
      const searchResults: SearchResults[] = token.extensions.map(
        (filetype: string) => {
          return this.getSnippetsFor(filetype);
        },
      );
      token.extensionSearchResults = searchResults;
    }
    return token;
  }

  parse(fileContent: string): Token {
    if (this.snippetType === "snipmate") {
      return parseSnipmate(fileContent);
    }

    throw new Error("no snippet type");
  }
}

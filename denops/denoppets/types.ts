import { Snippet } from "./snippet.ts";

export type Token = {
  snippets: Snippet[];
  priority?: number;
  functions?: string[];
  extensions?: string[];
  extensionSearchResults?: SearchResults[];
};

export type TokenWithFilename = {
  filename: string;
} & Token;

export type SearchResults = {
  searchKey: string;
  tokens: TokenWithFilename[];
};

export type SnippetType = "snipmate";

import { Denops } from "./deps.ts";
import { Denoppets } from "./denoppets.ts";
import { Snippet } from "./snippet.ts";
import { autocmd, execute } from "./deps.ts";
import { ensureString } from "./deps.ts";
import { Window } from "./window.ts";

export async function main(denops: Denops) {
  const unknown_rtp = await denops.eval("&rtp");
  const rtp = ensureString(unknown_rtp);
  const denoppets = new Denoppets(rtp.split(","));
  const currentWindow = new Window(denops);

  denops.dispatcher = {
    registerSource(arg1: unknown): Promise<void> {
      const ftEval = ensureString(arg1);
      const filetypes = ftEval.split(".");
      denoppets.registerSnippetsFor(filetypes);
      return Promise.resolve();
    },

    async snippetsInCurrentScope(): Promise<unknown> {
      const filetype = await denops.eval("&filetype") as string;
      const snippets = denoppets.currentSnippets(filetype.split("."));
      return snippets;
    },

    async canExpandSnippet(): Promise<boolean> {
      return !!(await _getSnippet(denoppets, currentWindow));
    },

    async expand(): Promise<void> {
      const snippet = await _getSnippet(denoppets, currentWindow) as Snippet;
      console.log(snippet);
      return Promise.resolve();
    },
  };

  await autocmd.group(denops, "register-source", (helper) => {
    helper.define(
      "BufEnter",
      "*",
      `call denops#notify('${denops.name}', 'registerSource', [&filetype])`,
    );
  });

  await execute(
    denops,
    `
    exec "inoremap <expr><silent> " . g:denoppets#key_map.expand . " denops#notify('${denops.name}', 'expand', [])"
    exec "snoremap <expr><silent> " . g:denoppets#key_map.expand . " denops#notify('${denops.name}', 'expand', [])"
    `,
  );
}

const _getSnippet = async (
  denoppets: Denoppets,
  currentWindow: Window,
): Promise<Snippet | undefined> => {
  const filetype = await currentWindow.denops.eval("&filetype") as string;
  const before = await currentWindow.before();
  if (typeof before === "string") {
    return denoppets.findSnippet(filetype.split("."), before);
  }
};

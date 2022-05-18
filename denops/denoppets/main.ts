import { Denops } from "./deps.ts";
import { Denoppets } from "./denoppets.ts";
import { Snippet } from "./snippet.ts";
import { autocmd, execute } from "./deps.ts";
import { ensureString } from "./deps.ts";
import { col, getline } from "./deps.ts";

export async function main(denops: Denops) {
  const unknown_rtp = await denops.eval("&rtp");
  const rtp = ensureString(unknown_rtp);
  const denoppets = new Denoppets(rtp.split(","));

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
      return !!(await _getSnippet(denops, denoppets));
    },

    async expand(): Promise<void> {
      const snippet = await _getSnippet(denops, denoppets) as Snippet;
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
  denops: Denops,
  denoppets: Denoppets,
): Promise<Snippet | undefined> => {
  const filetype = await denops.eval("&filetype") as string;
  const before = await _getBefore(denops);
  if (typeof before === "string") {
    return denoppets.findSnippet(filetype.split("."), before);
  }
};

const _getBefore = async (denops: Denops): Promise<string | undefined> => {
  const line = await getline(denops, ".");
  const before = line.slice(0, await col(denops, ".")).trim().split(" ").pop();
  return before;
};

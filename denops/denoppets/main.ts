import { Denops } from "./deps.ts";
import { Denoppets } from "./denoppets.ts";
import { autocmd, execute } from "./deps.ts";
import { ensureString } from "./deps.ts";

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
    inoremap <expr><silent> g:denoppets#key_map.expand call denops#notify('${denops.name}', 'expand')
    snoremap <expr><silent> g:denoppets#key_map.expand call denops#notify('${denops.name}', 'expand')
    `,
  );
}

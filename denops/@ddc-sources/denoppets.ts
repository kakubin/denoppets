import {
  BaseSource,
  DdcGatherItems,
} from "https://deno.land/x/ddc_vim@v2.0.0/types.ts#^";

import {
  GatherArguments,
} from "https://deno.land/x/ddc_vim@v2.0.0/base/source.ts#^";

export type Snippet = {
  trigger: string;
  description?: string;
};

type Params = Record<string, unknown>;

export class Source extends BaseSource<Params> {
  async gather(
    args: GatherArguments<Params>,
  ): Promise<DdcGatherItems> {
    // if (await args.denops.call("denops#server#status()") !== "running") { return [] }

    const snippets = await args.denops.dispatch(
      "denoppets",
      "snippetsInCurrentScope",
    ) as Snippet[];
    return snippets.map((snippet) => {
      return { word: snippet.trigger, menu: snippet.description };
    });
  }

  params(): Params {
    return {};
  }
}

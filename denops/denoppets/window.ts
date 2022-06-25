import type { Denops } from "./deps.ts";
import { col, getline } from "./deps.ts";

export class Window {
  denops: Denops;

  constructor(denops: Denops) {
    this.denops = denops;
  }

  async before(): Promise<string | undefined> {
    const line = await getline(this.denops, ".");
    const before = line.slice(0, await col(this.denops, ".")).trim().split(" ").pop();
    return before;
  }
}

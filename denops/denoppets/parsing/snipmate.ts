import { Token } from "../types.ts";
import { Snippet } from "./../snippet.ts";
import { assertEquals } from "./../deps.ts";

type headProps = {
  trigger: string;
  description?: string;
};

const createSnipInstance = (props: headProps): Snippet => {
  const newSnip = new Snippet(props.trigger);
  if (props.description) newSnip.description = props.description;
  return newSnip;
};

const parseHead = (header: string): headProps => {
  const props = header.split(" ");
  return (props.length > 2)
    ? { trigger: props[1], description: props.slice(2).join(" ") }
    : { trigger: props[1] };
};

const parseExtensions = (line: string): string[] =>
  line.replace("extends", "").replace(/\s/g, "").split(",");

export const parse = (fileContents: string): Token => {
  const lines = fileContents.split("\n");
  const snippets: Snippet[] = [];
  const extensions: string[] = [];

  for (const line of lines) {
    if (line.startsWith("#")) {
      continue;
    } else if (line.startsWith("extends")) {
      const _extensions = parseExtensions(line);
      extensions.push(..._extensions);
    } else if (line.startsWith("snippet")) {
      const snipProps = parseHead(line);
      snippets.push(createSnipInstance(snipProps));
    } else if (snippets.length > 0) {
      snippets[snippets.length - 1].value.push(
        line.startsWith("\t") ? line.replace(/\t/, "") : line,
      );
    }
  }

  return { snippets, extensions };
};

Deno.test("parseHead", () => {
  assertEquals(
    parseHead("snippet def"),
    { trigger: "def" },
  );
  assertEquals(
    parseHead("snippet caf allow function"),
    { trigger: "caf", description: "allow function" },
  );
  assertEquals(
    parseHead("snippet clai class .. initialize .. end"),
    { trigger: "clai", description: "class .. initialize .. end" },
  );
});

Deno.test("parseExtensions", () => {
  assertEquals(
    parseExtensions("extends"),
    [""],
  );
  assertEquals(
    parseExtensions("extends javascript"),
    ["javascript"],
  );
  assertEquals(
    parseExtensions("extends html, css, javascript"),
    ["html", "css", "javascript"],
  );
  assertEquals(
    parseExtensions("extends  html, css ,	javascript"),
    ["html", "css", "javascript"],
  );
});

Deno.test("createSnipInstance", () => {
  const props = { trigger: "caf", description: "allow function" };
  const snipInstance = new Snippet("caf");
  snipInstance.description = "allow function";
  assertEquals(createSnipInstance(props), snipInstance);
});

Deno.test("parse", () => {
  const body =
    "snippet obj\n	function object(o) {\n		function F() {}\n		F.prototype = o;\n		return new F();\n	}";
  const snipInstance = new Snippet("obj");
  const lines = [
    "function object(o) {",
    "	function F() {}",
    "	F.prototype = o;",
    "	return new F();",
    "}",
  ];
  snipInstance.value.push(...lines);
  assertEquals(parse(body), { extensions: [], snippets: [snipInstance] });
});

import { defineConfig, type Options } from "tsup";
import path from "node:path";
import pkj from "./package.json" assert { type: "json" };

type BuildOptions = {
  format: "cjs" | "esm";
  minify: boolean;
  target?: "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "esnext";
  dts?: boolean;
};

type ConfigOptions = {
  name: string;
  entry: string;
};

const buildTargets: BuildOptions[] = [
  {
    format: "cjs",
    target: "es2022",
    minify: true,
    dts: true,
  },
  {
    format: "esm",
    target: "es2022",
    minify: false,
  },
];

const defaultConfig = (
  { name, entry: entryPoints }: ConfigOptions,
  options: Options,
): Options[] => {
  const artifactOptions: Options[] = buildTargets.map(({ format, minify, target, dts }) => {
    const extension = format === "esm" ? ".esm.js" : ".cjs.js";
    const entry = { [name]: entryPoints };

    return {
      entry,
      dts,
      format,
      outDir: "dist",
      bundle: true,
      target,
      tsconfig: path.resolve(process.cwd(), "tsconfig.lib.json"),
      outExtension: () => ({ js: extension }),
      minify,
      splitting: false,
      sourcemap: false,
      platform: "browser",
      clean: !options.watch || true,
    };
  });

  return artifactOptions;
};

export default defineConfig((opts) =>
  defaultConfig(
    {
      entry: pkj.source,
      name: pkj.name,
    },
    opts,
  ),
);

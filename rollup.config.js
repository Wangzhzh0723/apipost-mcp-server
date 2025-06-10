import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import { execSync } from "child_process";

const isDev = process.env.npm_lifecycle_event === "dev";
const packageVersion = process.env.npm_package_version;

const replacePlugin = replace({
  preventAssignment: true,
  "process.env.NPM_PACKAGE_VERSION": JSON.stringify(packageVersion),
});

export default defineConfig([
  // 配置 index.js 入口
  {
    input: "src/index.js",
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: isDev,
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      replacePlugin,
      !isDev && terser(),
    ].filter(Boolean),
    external: [
      // 外部依赖，避免打包进bundle
      "@modelcontextprotocol/sdk",
      "axios",
      "dotenv",
      "yargs",
      "zod",
      "path",
      "fs",
    ],
  },
  // 配置 cli.js 入口
  {
    input: "src/cli.js",
    output: {
      file: "dist/cli.js",
      format: "esm",
      sourcemap: isDev,
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      replacePlugin,
      !isDev && terser(),
      isDev && {
        name: "execute-on-success",
        writeBundle() {
          console.log("Running CLI in development mode...");
          try {
            execSync("node dist/cli.js", { stdio: "inherit" });
          } catch (error) {
            console.error("Failed to run CLI:", error);
          }
        },
      },
    ].filter(Boolean),
    external: [
      // 外部依赖，避免打包进bundle
      "@modelcontextprotocol/sdk",
      "axios",
      "dotenv",
      "yargs",
      "zod",
      "path",
      "fs",
    ],
  },
]);
